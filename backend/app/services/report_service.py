import json
from datetime import datetime, timezone
from typing import Dict, Any

class ReportService:
    @staticmethod
    def generate_json_report(diagnosis_payload: Dict[str, Any]) -> str:
        """Serializes full audit trail and technical diagnosis to formatted JSON."""
        return json.dumps(diagnosis_payload, indent=2)

    @staticmethod
    def generate_html_report(report_data: Dict[str, Any]) -> str:
        """
        Renders a clean, executive-level technical HTML report designed for
        browser printing and PDF saving.
        """
        title = report_data.get("circuit_name", "QuantumTrace Investigation")
        created_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        summary = report_data.get("executive_summary", "No summary provided.")
        primary_hyp = report_data.get("primary_hypothesis", "N/A")
        tv = report_data.get("total_variation_distance", 0.0)
        confidence = report_data.get("confidence_category", "High Evidence")
        ranked_hyps = report_data.get("ranked_hypotheses", [])

        hyp_rows = ""
        for h in ranked_hyps:
            hyp_rows += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>#{h.get('rank', 1)}</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">{h.get('hypothesis', '')}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #f97316;">{h.get('calibrated_score', 0):.2f}</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 0.85em; color: #4b5563;">{h.get('provenance', '')}</td>
            </tr>
            """

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>QuantumTrace AI - Scientific Investigation Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 40px;
            color: #1f2937;
            background-color: #fafafa;
            line-height: 1.6;
        }}
        .header {{
            border-bottom: 2px solid #ea580c;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }}
        .title {{ font-size: 26px; font-weight: 700; color: #111827; margin: 0; }}
        .badge {{
            display: inline-block;
            background: #fff7ed;
            color: #c2410c;
            border: 1px solid #fed7aa;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }}
        .card {{
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }}
        table {{ width: 100%; border-collapse: collapse; text-align: left; }}
        th {{ background: #f9fafb; padding: 12px 10px; font-size: 13px; font-weight: 600; color: #4b5563; }}
        .meta-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }}
        .meta-item {{ background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6; }}
        .meta-label {{ font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: 600; }}
        .meta-val {{ font-size: 16px; font-weight: 700; color: #111827; }}
    </style>
</head>
<body>
    <div class="header">
        <span class="badge">QuantumTrace AI Diagnosis Audit</span>
        <h1 class="title" style="margin-top: 8px;">{title}</h1>
        <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Generated on {created_at}</p>
    </div>

    <div class="meta-grid">
        <div class="meta-item">
            <div class="meta-label">Primary Diagnosis</div>
            <div class="meta-val" style="font-size: 14px; color: #ea580c;">{primary_hyp}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Total Variation Distance</div>
            <div class="meta-val">{tv:.4f}</div>
        </div>
        <div class="meta-item">
            <div class="meta-label">Confidence Assessment</div>
            <div class="meta-val">{confidence}</div>
        </div>
    </div>

    <div class="card">
        <h3 style="margin-top: 0; color: #111827;">Executive Finding</h3>
        <p style="color: #374151;">{summary}</p>
    </div>

    <div class="card">
        <h3 style="margin-top: 0; color: #111827;">Directed Hypotheses Ranking</h3>
        <table>
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Hypothesis</th>
                    <th>Score</th>
                    <th>Evidence Provenance</th>
                </tr>
            </thead>
            <tbody>
                {hyp_rows}
            </tbody>
        </table>
    </div>

    <div class="card">
        <h3 style="margin-top: 0; color: #111827;">Verification & Reproducibility</h3>
        <p style="font-size: 13px; color: #4b5563;">
            This report represents an immutable record generated by the QuantumTrace AI debugging engine.
            Simulation outputs, cryptographic hashes, and statistical distributions are persisted in PostgreSQL.
        </p>
    </div>
</body>
</html>
"""
        return html

