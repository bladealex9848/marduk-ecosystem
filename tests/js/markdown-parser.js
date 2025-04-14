/**
 * Procesador simple de Markdown para respuestas de modelos
 */

// Función para convertir Markdown a HTML
function parseMarkdown(text) {
    if (!text) return '';
    
    // Escapar caracteres HTML
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // Procesar bloques de código
    html = html.replace(/```([a-z]*)\n([\s\S]*?)\n```/g, function(match, language, code) {
        return `<div class="code-block${language ? ' language-' + language : ''}"><pre><code>${code}</code></pre></div>`;
    });
    
    // Procesar código en línea
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Procesar encabezados
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Procesar negritas
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Procesar cursivas
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Procesar listas
    html = html.replace(/^\s*\* (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
    
    // Procesar listas numeradas
    html = html.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n)+/g, '<ol>$&</ol>');
    
    // Procesar enlaces
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Procesar párrafos (líneas que no son encabezados, listas, etc.)
    html = html.replace(/^(?!<h|<ul|<ol|<li|<div|<p)(.+)$/gm, '<p>$1</p>');
    
    // Procesar saltos de línea
    html = html.replace(/\n\n/g, '<br>');
    
    return html;
}
