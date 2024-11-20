<?php
// Initialize the price HTML with an escaped class attribute
$price_html = '<div class="awcpt-price">';

// Get the product price HTML and escape it to prevent XSS attacks
$price_html .= wp_kses_post( $product->get_price_html() );

// Close the div
$price_html .= '</div>';

// Output the sanitized price HTML
echo $price_html;
