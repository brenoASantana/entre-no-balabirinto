.PHONY: help install run analyze clean

help:
	@echo "📊 Analytics - Entre no Balabirinto"
	@echo ""
	@echo "Comandos disponíveis:"
	@echo "  make install      - Instalar dependências Python"
	@echo "  make analyze      - Executar análises e gerar relatórios"
	@echo "  make run          - Atalho para 'make analyze'"
	@echo "  make clean        - Limpar arquivos gerados"
	@echo "  make report       - Abrir relatório HTML no navegador (Linux)"
	@echo ""

install:
	@echo "📦 Instalando dependências..."
	pip install -r requirements.txt
	@echo "✅ Dependências instaladas!"

analyze:
	@echo "📊 Executando análises de gameplay..."
	python3 main.py

run: analyze

clean:
	@echo "🧹 Limpando arquivos..."
	rm -rf reports/charts/*.png
	rm -f reports/analytics_report.html
	@echo "✅ Limpeza concluída!"

report:
	@echo "🌐 Abrindo relatório..."
	@if [ -f reports/analytics_report.html ]; then \
		xdg-open reports/analytics_report.html; \
	else \
		echo "❌ Relatório não encontrado. Execute 'make analyze' primeiro."; \
	fi
