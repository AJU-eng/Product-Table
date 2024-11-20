<?php
if ( $product->has_dimensions() ) {
    $dimension_html = '<div class="awcpt-dimensions">';
    // Sanitize the dimensions output using esc_html
    $dimension_html .= esc_html( wc_format_dimensions( $product->get_dimensions( false ) ) );
    $dimension_html .= '</div>';

    echo $dimension_html; // Output sanitized HTML
} else {
    return;
}
