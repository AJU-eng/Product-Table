<?php
$type = $column['type'];
if( !empty( $column['format'] ) ){
    $format = $column['format'];
} else {
    $format = get_option( 'date_format' );
}

if( $type == 'published' ){
    $date = get_the_date( $format );
} else {
    $date_modified = $prd_data['date_modified'];
    $date = $date_modified->date( $format );
}

// Sanitize the date output
$date_html = '<span class="awcpt-date">';
$date_html .= esc_html($date); // Escape the date for safe output
$date_html .= '</span>';

echo $date_html; // Output sanitized HTML
