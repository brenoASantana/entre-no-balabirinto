"""
Analytics Package
Sistema de análise de padrões de gameplay
"""

from .database import ScoreDatabase, GameScore
from .analyzer import GameplayAnalyzer, PlayerStats, GameplayMetrics
from .visualizer import GameplayVisualizer

__version__ = "1.0.0"
__all__ = [
    "ScoreDatabase",
    "GameScore",
    "GameplayAnalyzer",
    "PlayerStats",
    "GameplayMetrics",
    "GameplayVisualizer",
]
