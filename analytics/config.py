"""
Configuração do sistema de analytics
Define caminho do banco de dados e constantes de análise
"""
import os
from pathlib import Path

# Diretórios
PROJECT_ROOT = Path(__file__).parent.parent
DATABASE_PATH = PROJECT_ROOT / "backend" / "leaderboard.db"
OUTPUT_DIR = Path(__file__).parent / "reports"
CHARTS_DIR = OUTPUT_DIR / "charts"

# Criar diretórios se não existirem
OUTPUT_DIR.mkdir(exist_ok=True)
CHARTS_DIR.mkdir(exist_ok=True)

# Configurações de análise
WAVE_THRESHOLDS = {
    "beginner": 3,
    "intermediate": 6,
    "advanced": 10,
    "expert": 15,
}

SCORE_THRESHOLDS = {
    "bronze": 1000,
    "silver": 5000,
    "gold": 10000,
    "platinum": 20000,
    "diamond": 50000,
}

# Configurações de visualização
CHART_STYLE = "seaborn-v0_8-darkgrid"
FIGURE_DPI = 100
FIGURE_SIZE = (12, 7)
COLOR_PALETTE = "husl"

# Logging
LOG_FORMAT = "[%(asctime)s] %(levelname)s: %(message)s"
LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
