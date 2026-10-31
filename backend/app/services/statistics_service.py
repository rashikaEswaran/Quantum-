import math
from typing import Dict, Any, Tuple

class StatisticsService:
    @staticmethod
    def compare_distributions(
        dist_p: Dict[str, float], 
        dist_q: Dict[str, float],
        shots_p: int = 2048,
        shots_q: int = 2048
    ) -> Dict[str, Any]:
        """
        Performs mathematically rigorous statistical comparison between two probability distributions.
        Handles zero counts, aligns outcome spaces, and computes TVD, Hellinger, JSD, and hypothesis significance.
        """
        # 1. Align outcome spaces (union of all observed bitstrings)
        all_keys = sorted(list(set(dist_p.keys()) | set(dist_q.keys())))
        
        sum_p = sum(dist_p.values()) or 1.0
        sum_q = sum(dist_q.values()) or 1.0
        
        aligned_p = {k: dist_p.get(k, 0.0) / sum_p for k in all_keys}
        aligned_q = {k: dist_q.get(k, 0.0) / sum_q for k in all_keys}

        # 2. Total Variation Distance (TV): TV(P, Q) = 0.5 * \sum |P_i - Q_i|
        tv_distance = 0.5 * sum(abs(aligned_p[k] - aligned_q[k]) for k in all_keys)

        # 3. Hellinger Distance: H(P, Q) = 1/sqrt(2) * sqrt( \sum (sqrt(P_i) - sqrt(Q_i))^2 )
        sq_diff_sum = sum((math.sqrt(aligned_p[k]) - math.sqrt(aligned_q[k]))**2 for k in all_keys)
        hellinger = (1.0 / math.sqrt(2.0)) * math.sqrt(sq_diff_sum)

        # 4. Jensen-Shannon Divergence: JSD(P, Q) = 0.5 * KL(P || M) + 0.5 * KL(Q || M)
        # where M = 0.5 * (P + Q)
        js_divergence = 0.0
        for k in all_keys:
            p_val = aligned_p[k]
            q_val = aligned_q[k]
            m_val = 0.5 * (p_val + q_val)
            
            if p_val > 1e-12 and m_val > 1e-12:
                js_divergence += 0.5 * (p_val * math.log2(p_val / m_val))
            if q_val > 1e-12 and m_val > 1e-12:
                js_divergence += 0.5 * (q_val * math.log2(q_val / m_val))

        # Clamp JS divergence to [0, 1] bits
        js_divergence = max(0.0, min(1.0, js_divergence))

        # 5. Two-sample Chi-Square / Z-Score Test for Statistical Divergence
        # Tests null hypothesis H0: Both distributions arise from identical physical quantum state
        chi_square_stat = 0.0
        df = max(1, len(all_keys) - 1)
        
        for k in all_keys:
            count_p = aligned_p[k] * shots_p
            count_q = aligned_q[k] * shots_q
            pooled_prob = (count_p + count_q) / (shots_p + shots_q)
            
            if pooled_prob > 1e-6:
                expected_p = pooled_prob * shots_p
                expected_q = pooled_prob * shots_q
                chi_square_stat += ((count_p - expected_p)**2) / expected_p
                chi_square_stat += ((count_q - expected_q)**2) / expected_q

        # Wilson / critical value threshold at alpha = 0.01
        # Approximate p-value via normal transform for chi-square: z = sqrt(2*chi2) - sqrt(2*df - 1)
        if df > 1:
            z_score = math.sqrt(2 * max(chi_square_stat, 0.0)) - math.sqrt(2 * df - 1)
        else:
            z_score = math.sqrt(max(chi_square_stat, 0.0))

        reject_null = tv_distance > 0.05 and z_score > 2.576 # 99% confidence threshold

        # Interpretation
        if tv_distance < 0.02:
            interpretation = "Distributions show negligible variation consistent with finite sample shot noise."
        elif tv_distance < 0.10:
            interpretation = "Mild divergence detected: minor gate or readout imperfections present."
        elif tv_distance < 0.30:
            interpretation = "Significant divergence detected: prominent noise channels (e.g. depolarizing or dephasing) altering state fidelity."
        else:
            interpretation = "Severe divergence: substantial state degradation or systematic circuit flaw observed."

        return {
            "total_variation_distance": round(tv_distance, 4),
            "hellinger_distance": round(hellinger, 4),
            "jensen_shannon_divergence": round(js_divergence, 4),
            "aligned_outcomes": all_keys,
            "distribution_p": aligned_p,
            "distribution_q": aligned_q,
            "statistical_significance": {
                "chi_square_statistic": round(chi_square_stat, 2),
                "degrees_of_freedom": df,
                "z_score": round(z_score, 2),
                "reject_null_hypothesis_at_99pct": reject_null,
                "significance_threshold_alpha": 0.01
            },
            "interpretation": interpretation
        }

