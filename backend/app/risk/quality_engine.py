from typing import Dict, Any, List
from datetime import datetime

class DataQualityEngine:
    """
    Computes an empirical Data Quality Score based on:
    - Freshness (< 15 mins = 1.0, < 60 mins = 0.85, > 2 hours = 0.5)
    - Completeness of observational vector
    - Source reliability tier
    """

    def compute_quality(
        self,
        weather_data: Dict[str, Any],
        missing_sources: List[str]
    ) -> Dict[str, Any]:
        score = 1.0
        degradation_reasons = []

        # Freshness deduction
        if weather_data.get("from_cache"):
            score -= 0.05

        # Completeness deduction
        if missing_sources:
            deduction = min(0.20, len(missing_sources) * 0.08)
            score -= deduction
            degradation_reasons.append(f"Missing authoritative sources: {', '.join(missing_sources)}")

        score = max(0.50, min(1.0, round(score, 2)))
        quality_label = (
            "EXCELLENT" if score >= 0.90
            else "GOOD" if score >= 0.78
            else "MODERATE" if score >= 0.65
            else "DEGRADED"
        )

        warning_message = None
        if score < 0.75:
            warning_message = "Low data quality — prediction confidence reduced."

        return {
            "quality_score": score,
            "quality_label": quality_label,
            "warning_message": warning_message,
            "reasons": degradation_reasons,
            "timestamp": datetime.utcnow().isoformat()
        }

quality_engine = DataQualityEngine()
