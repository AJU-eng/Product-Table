<?php
$stock_html = '<div class="awcpt-stock">';
$stock_html .= wc_get_stock_html( $product ); // WooCommerce function, already handles sanitization.
$stock_html .= '</div>';

echo wp_kses_post( $stock_html ); // Escaping the final output
