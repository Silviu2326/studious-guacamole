#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para generar el JSON de módulos a partir de los archivos Markdown extraídos.
"""

import json
import os
from pathlib import Path

def convertir_a_nombre_modulo(nombre_archivo):
    """Convierte un nombre de archivo a un nombre de módulo legible."""
    # Remover la extensión .md
    nombre = nombre_archivo.replace('.md', '')
    
    # Reemplazar guiones y caracteres especiales con espacios
    nombre = nombre.replace('-', ' ').replace('_', ' ')
    nombre = nombre.replace('&', 'y').replace('(', '').replace(')', '')
    
    # Capitalizar cada palabra
    palabras = nombre.split()
    nombre_modulo = ''.join(palabra.capitalize() for palabra in palabras if palabra)
    
    return nombre_modulo


def main():
    """Genera el JSON con todos los módulos."""
    notion_dir = Path("notion-subpages")
    
    # Obtener todos los archivos .md
    archivos_md = sorted([f.name for f in notion_dir.glob("*.md")])
    
    # Crear la lista de módulos
    modulos = []
    for archivo in archivos_md:
        nombre_modulo = convertir_a_nombre_modulo(archivo)
        modulos.append({
            "modulo": nombre_modulo,
            "archivo_md": archivo
        })
    
    # Crear la estructura JSON completa
    estructura = {
        "modulos": modulos,
        "configuracion": {
            "tiempo_espera": 30,
            "modo": "secuencial",
            "reintentos": 2
        },
        "descripcion": f"Archivo con {len(modulos)} módulos diferentes para el modo MD → Módulo"
    }
    
    # Guardar el JSON
    with open("modulos_notion.json", "w", encoding="utf-8") as f:
        json.dump(estructura, f, ensure_ascii=False, indent=2)
    
    print(f"JSON generado con {len(modulos)} modulos")
    print(f"Archivo guardado: modulos_notion.json")


if __name__ == "__main__":
    main()

