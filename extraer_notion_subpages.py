#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para extraer todas las sub-sub páginas de Notion y guardarlas como archivos Markdown.
"""

import os
import json
import re
import sys
from pathlib import Path
from notion_client import Client
import time

# Configurar salida UTF-8 para Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

# Configuración
NOTION_TOKEN = "ntn_P1870053076eY2ek28YAEAW0RKQJsmIschJrVUvTn7m7Xi"
PAGE_ID = "29f06f76bed4805db1bdf66af92e36ea"  # ID extraído de la URL
OUTPUT_DIR = "notion-subpages"

# Inicializar cliente de Notion
notion = Client(auth=NOTION_TOKEN)


def safe_print(text):
    """Imprime texto de manera segura, manejando emojis y caracteres especiales."""
    try:
        print(text)
    except UnicodeEncodeError:
        # Si hay problemas con la codificación, intentar sin emojis
        safe_text = text.encode('ascii', 'ignore').decode('ascii')
        print(safe_text)


def sanitize_filename(filename):
    """Convierte un nombre de página en un nombre de archivo válido."""
    # Remover caracteres especiales y reemplazar espacios con guiones
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    filename = filename.replace(' ', '-').lower()
    # Limpiar caracteres acentuados
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', 'ü': 'u',
        'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
        'Ñ': 'N', 'Ü': 'U'
    }
    for old, new in replacements.items():
        filename = filename.replace(old, new)
    return filename


def extract_text_from_block(block):
    """Extrae texto de un bloque de Notion."""
    text_content = ""
    
    if block.get('type') == 'paragraph':
        paragraph = block['paragraph']
        if 'rich_text' in paragraph:
            for text_obj in paragraph['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += text_obj['plain_text']
            text_content += "\n"
    
    elif block.get('type') == 'heading_1':
        heading = block['heading_1']
        if 'rich_text' in heading:
            for text_obj in heading['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"# {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'heading_2':
        heading = block['heading_2']
        if 'rich_text' in heading:
            for text_obj in heading['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"## {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'heading_3':
        heading = block['heading_3']
        if 'rich_text' in heading:
            for text_obj in heading['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"### {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'bulleted_list_item':
        item = block['bulleted_list_item']
        if 'rich_text' in item:
            for text_obj in item['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"- {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'numbered_list_item':
        item = block['numbered_list_item']
        if 'rich_text' in item:
            for text_obj in item['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"1. {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'to_do':
        todo = block['to_do']
        checked = "✓" if todo.get('checked', False) else "☐"
        if 'rich_text' in todo:
            for text_obj in todo['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"- [{checked}] {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'code':
        code = block['code']
        language = code.get('language', '')
        if 'rich_text' in code:
            code_text = ""
            for text_obj in code['rich_text']:
                if 'plain_text' in text_obj:
                    code_text += text_obj['plain_text']
            text_content += f"```{language}\n{code_text}\n```\n"
    
    elif block.get('type') == 'quote':
        quote = block['quote']
        if 'rich_text' in quote:
            for text_obj in quote['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"> {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'callout':
        callout = block['callout']
        if 'rich_text' in callout:
            for text_obj in callout['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"> {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'divider':
        text_content += "---\n"
    
    elif block.get('type') == 'table':
        text_content += "[Tabla]\n"
    
    elif block.get('type') == 'toggle':
        toggle = block['toggle']
        if 'rich_text' in toggle:
            for text_obj in toggle['rich_text']:
                if 'plain_text' in text_obj:
                    text_content += f"▶ {text_obj['plain_text']}\n"
    
    elif block.get('type') == 'child_page':
        # Ignorar las referencias a páginas hijas (ya las procesamos por separado)
        pass
    
    return text_content


def get_page_content(page_id):
    """Obtiene el contenido de una página de Notion."""
    content = ""
    start_cursor = None
    
    while True:
        try:
            if start_cursor:
                response = notion.blocks.children.list(block_id=page_id, start_cursor=start_cursor)
            else:
                response = notion.blocks.children.list(block_id=page_id)
            
            blocks = response.get('results', [])
            
            for block in blocks:
                content += extract_text_from_block(block)
                # Si el bloque tiene hijos, obtenerlos recursivamente
                if block.get('has_children', False):
                    child_content = get_block_children(block['id'])
                    content += child_content
            
            if not response.get('has_more', False):
                break
            
            start_cursor = response.get('next_cursor')
            time.sleep(0.3)  # Rate limiting
            
        except Exception as e:
            print(f"Error obteniendo contenido de página {page_id}: {e}")
            break
    
    return content


def get_block_children(block_id):
    """Obtiene los hijos de un bloque recursivamente."""
    content = ""
    start_cursor = None
    
    while True:
        try:
            if start_cursor:
                response = notion.blocks.children.list(block_id=block_id, start_cursor=start_cursor)
            else:
                response = notion.blocks.children.list(block_id=block_id)
            
            blocks = response.get('results', [])
            
            for block in blocks:
                content += extract_text_from_block(block)
                if block.get('has_children', False):
                    content += get_block_children(block['id'])
            
            if not response.get('has_more', False):
                break
            
            start_cursor = response.get('next_cursor')
            time.sleep(0.3)
            
        except Exception as e:
            print(f"Error obteniendo hijos del bloque {block_id}: {e}")
            break
    
    return content


def get_child_pages(parent_id):
    """Obtiene todas las páginas hijas de una página padre."""
    child_pages = []
    start_cursor = None
    
    while True:
        try:
            if start_cursor:
                response = notion.blocks.children.list(block_id=parent_id, start_cursor=start_cursor)
            else:
                response = notion.blocks.children.list(block_id=parent_id)
            
            blocks = response.get('results', [])
            
            for block in blocks:
                if block.get('type') == 'child_page':
                    page_id = block['id']
                    page_info = notion.pages.retrieve(page_id)
                    title = ""
                    if 'properties' in page_info:
                        # Intentar obtener el título desde diferentes propiedades
                        for prop_name, prop_value in page_info['properties'].items():
                            if prop_value.get('type') == 'title':
                                if 'title' in prop_value:
                                    for title_part in prop_value['title']:
                                        if 'plain_text' in title_part:
                                            title += title_part['plain_text']
                                    break
                    if not title:
                        # Si no hay título en properties, intentar desde el bloque
                        if 'child_page' in block and 'title' in block['child_page']:
                            title = block['child_page']['title']
                    
                    child_pages.append({
                        'id': page_id,
                        'title': title or 'Sin título'
                    })
            
            if not response.get('has_more', False):
                break
            
            start_cursor = response.get('next_cursor')
            time.sleep(0.3)
            
        except Exception as e:
            print(f"Error obteniendo páginas hijas de {parent_id}: {e}")
            break
    
    return child_pages


def save_page_as_markdown(page_id, page_title, parent_title, output_dir):
    """Guarda una página de Notion como archivo Markdown."""
    safe_print(f"Extrayendo: {parent_title} > {page_title}")
    
    # Obtener contenido
    content = get_page_content(page_id)
    
    # Crear encabezado
    markdown = f"# {page_title}\n\n"
    markdown += f"**Página padre:** {parent_title}\n\n"
    markdown += "---\n\n"
    markdown += content
    
    # Guardar archivo
    filename = sanitize_filename(page_title)
    filepath = Path(output_dir) / f"{filename}.md"
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(markdown)
    
    safe_print(f"✓ Guardado: {filepath}")
    return filepath


def main():
    """Función principal."""
    # Crear directorio de salida
    output_path = Path(OUTPUT_DIR)
    output_path.mkdir(exist_ok=True)
    safe_print(f"Directorio de salida: {output_path.absolute()}\n")
    
    # Obtener todas las páginas (sub-páginas directas de "Hola")
    safe_print("Obteniendo todas las páginas...")
    pages = get_child_pages(PAGE_ID)
    safe_print(f"Encontradas {len(pages)} páginas\n")
    
    total_pages = 0
    
    # Guardar cada página como archivo MD
    for page in pages:
        page_title = page['title']
        page_id = page['id']
        
        safe_print(f"\n{'='*60}")
        safe_print(f"Extrayendo: {page_title}")
        safe_print(f"{'='*60}")
        
        # Guardar la página directamente
        save_page_as_markdown(
            page_id,
            page_title,
            "Hola",
            OUTPUT_DIR
        )
        total_pages += 1
        time.sleep(0.5)  # Rate limiting
    
    safe_print(f"\n{'='*60}")
    safe_print(f"✓ Proceso completado!")
    safe_print(f"✓ Total de páginas extraídas: {total_pages}")
    safe_print(f"✓ Archivos guardados en: {output_path.absolute()}")
    safe_print(f"{'='*60}")


if __name__ == "__main__":
    main()

