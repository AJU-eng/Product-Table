<?php
$html_val = isset($column['value']) ? $column['value'] : '';

if( !empty($html_val) ){
    // Sanitize the HTML content
    $sanitized_html_val = wp_kses_post($html_val);
    
    $html_output = '<div class="awcpt-html-wrap">';
    $html_output .= $sanitized_html_val; // Use the sanitized HTML value
    $html_output .= '</div>';

    echo $html_output;
} else {
    return;
}
