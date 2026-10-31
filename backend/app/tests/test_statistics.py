import pytest
from app.services.statistics_service import StatisticsService

def test_identical_distributions():
    p = {"00": 0.5, "11": 0.5}
    q = {"00": 0.5, "11": 0.5}
    stats = StatisticsService.compare_distributions(p, q, 2048, 2048)
    assert stats["total_variation_distance"] == 0.0
    assert stats["hellinger_distance"] == 0.0
    assert stats["jensen_shannon_divergence"] == 0.0
    assert stats["statistical_significance"]["reject_null_hypothesis_at_99pct"] is False

def test_orthogonal_distributions():
    p = {"00": 1.0}
    q = {"11": 1.0}
    stats = StatisticsService.compare_distributions(p, q, 2048, 2048)
    # Total variation between disjoint distributions is exactly 1.0
    assert pytest.approx(stats["total_variation_distance"], 0.001) == 1.0
    assert pytest.approx(stats["hellinger_distance"], 0.001) == 1.0
    assert pytest.approx(stats["jensen_shannon_divergence"], 0.001) == 1.0
    assert stats["statistical_significance"]["reject_null_hypothesis_at_99pct"] is True

def test_zero_count_safety():
    # Should safely align and not throw MathDomain error or ZeroDivisionError
    p = {"00": 0.99, "01": 0.01}
    q = {"00": 0.50, "11": 0.50}
    stats = StatisticsService.compare_distributions(p, q, 1024, 1024)
    assert stats["total_variation_distance"] > 0.4

