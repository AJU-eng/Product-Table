<?php
$excerpt_html = '<div class="awcpt-excerpt">';
$excerpt_html .= wp_kses_post( get_the_excerpt() ); // Sanitize while allowing some HTML tags
$excerpt_html .= '</div>';

echo $excerpt_html; // Output sanitized HTML
