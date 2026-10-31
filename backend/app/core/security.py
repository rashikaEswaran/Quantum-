import ast
import re
from typing import Tuple, List

# Strict whitelist of allowed quantum and numerical packages
ALLOWED_MODULES = {
    "qiskit", "qiskit.circuit", "qiskit.quantum_info", "qiskit_aer", "qiskit_aer.noise",
    "numpy", "np", "math", "cmath"
}

FORBIDDEN_FUNCTIONS = {
    "eval", "exec", "compile", "__import__", "open", "input", "globals", "locals",
    "getattr", "setattr", "delattr", "system", "popen", "spawn", "fork", "subprocess",
    "socket", "urllib", "requests", "shutil", "os", "sys"
}

MAX_CODE_SIZE_BYTES = 100 * 1024  # 100 KB max circuit file
MAX_SHOT_COUNT = 100000

def validate_quantum_code_safety(code_str: str) -> Tuple[bool, List[str]]:
    """
    Validates Python source code using AST inspection to ensure safe execution.
    Rejects any attempts to access filesystem, networking, subprocesses, or arbitrary builtins.
    """
    issues = []
    
    if len(code_str.encode("utf-8")) > MAX_CODE_SIZE_BYTES:
        return False, [f"Code payload exceeds maximum size limit ({MAX_CODE_SIZE_BYTES} bytes)"]
        
    try:
        tree = ast.parse(code_str)
    except SyntaxError as e:
        return False, [f"Syntax error at line {e.lineno}: {e.msg}"]

    for node in ast.walk(tree):
        # Disallow imports outside allowed scientific/quantum libraries
        if isinstance(node, ast.Import):
            for alias in node.names:
                root_pkg = alias.name.split('.')[0]
                if root_pkg not in {"qiskit", "qiskit_aer", "numpy", "math", "cmath"}:
                    issues.append(f"Disallowed import: '{alias.name}'. Only quantum/math modules are permitted.")
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                root_pkg = node.module.split('.')[0]
                if root_pkg not in {"qiskit", "qiskit_aer", "numpy", "math", "cmath"}:
                    issues.append(f"Disallowed module import: '{node.module}'.")

        # Disallow calls to forbidden builtins or OS hooks
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in FORBIDDEN_FUNCTIONS:
                    issues.append(f"Forbidden function call: '{node.func.id}()'.")
            elif isinstance(node.func, ast.Attribute):
                if node.func.attr in FORBIDDEN_FUNCTIONS:
                    issues.append(f"Forbidden method invocation: '{node.func.attr}()'.")
                    
        # Disallow dunder access
        elif isinstance(node, ast.Attribute):
            if node.attr.startswith("__") and node.attr.endswith("__"):
                issues.append(f"Access to private dunder attribute '{node.attr}' is prohibited.")

    return (len(issues) == 0, issues)


def mask_sensitive_token(token: str) -> str:
    """Masks secret tokens for safe presentation in logs or telemetry."""
    if not token or len(token) < 8:
        return "***"
    return token[:4] + "..." + token[-4:]

