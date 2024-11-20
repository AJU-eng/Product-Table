<?php
$text_val = ! empty( $column['value'] ) ? $column['value'] : null;

if( $text_val ) {
    $text_html = '<div class="awcpt-txt-wrap">';
    $text_html .= esc_html( $text_val ); // Sanitize the text value
    $text_html .= '</div>';

    echo $text_html;
} else {
    return;
}
