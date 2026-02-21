"""
Camada de acesso ao banco de dados
Fornece funções para buscar dados do SQLite
"""
import sqlite3
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional
from config import DATABASE_PATH
import logging

logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger(__name__)


@dataclass
class GameScore:
    """Representa um score no banco de dados"""
    id: int
    player_name: str
    score: int
    wave: int
    time_alive: float
    created_at: str


class ScoreDatabase:
    """Gerencia conexão e queries ao banco de dados SQLite"""

    def __init__(self, db_path: str = str(DATABASE_PATH)):
        self.db_path = db_path
        self._validate_db_exists()

    def _validate_db_exists(self):
        """Valida se o banco de dados existe"""
        if not DATABASE_PATH.exists():
            logger.warning(
                f"Banco de dados não encontrado em {self.db_path}. "
                "Execute o servidor Go para criar o banco."
            )
        else:
            logger.info(f"Banco de dados encontrado: {self.db_path}")

    def connect(self) -> sqlite3.Connection:
        """Cria conexão com o banco de dados"""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.Error as e:
            logger.error(f"Erro ao conectar ao banco de dados: {e}")
            raise

    def get_all_scores(self) -> List[GameScore]:
        """Busca todos os scores ordenados por data"""
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, player_name, score, wave, time_alive, created_at
                FROM game_scores
                ORDER BY created_at DESC
                """
            )
            rows = cursor.fetchall()
            conn.close()
            return [GameScore(*row) for row in rows]
        except sqlite3.Error as e:
            logger.error(f"Erro ao buscar scores: {e}")
            return []

    def get_scores_by_player(self, player_name: str) -> List[GameScore]:
        """Busca todos os scores de um jogador específico"""
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, player_name, score, wave, time_alive, created_at
                FROM game_scores
                WHERE player_name = ?
                ORDER BY created_at DESC
                """,
                (player_name,),
            )
            rows = cursor.fetchall()
            conn.close()
            return [GameScore(*row) for row in rows]
        except sqlite3.Error as e:
            logger.error(f"Erro ao buscar scores do jogador {player_name}: {e}")
            return []

    def get_top_scores(self, limit: int = 10) -> List[GameScore]:
        """Busca os top scores"""
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, player_name, score, wave, time_alive, created_at
                FROM game_scores
                ORDER BY score DESC
                LIMIT ?
                """,
                (limit,),
            )
            rows = cursor.fetchall()
            conn.close()
            return [GameScore(*row) for row in rows]
        except sqlite3.Error as e:
            logger.error(f"Erro ao buscar top scores: {e}")
            return []

    def get_unique_players(self) -> List[str]:
        """Busca lista de jogadores únicos"""
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT player_name FROM game_scores ORDER BY player_name")
            rows = cursor.fetchall()
            conn.close()
            return [row[0] for row in rows]
        except sqlite3.Error as e:
            logger.error(f"Erro ao buscar jogadores únicos: {e}")
            return []

    def get_player_count(self) -> int:
        """Retorna número total de jogadores únicos"""
        return len(self.get_unique_players())

    def get_total_games_played(self) -> int:
        """Retorna número total de jogos"""
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM game_scores")
            result = cursor.fetchone()
            conn.close()
            return result[0] if result else 0
        except sqlite3.Error as e:
            logger.error(f"Erro ao contar jogos: {e}")
            return 0

    def get_scores_in_date_range(
        self, start_date: str, end_date: str
    ) -> List[GameScore]:
        """Busca scores dentro de um intervalo de datas"""
        try:
            conn = self.connect()
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT id, player_name, score, wave, time_alive, created_at
                FROM game_scores
                WHERE created_at BETWEEN ? AND ?
                ORDER BY created_at DESC
                """,
                (start_date, end_date),
            )
            rows = cursor.fetchall()
            conn.close()
            return [GameScore(*row) for row in rows]
        except sqlite3.Error as e:
            logger.error(f"Erro ao buscar scores por período: {e}")
            return []
