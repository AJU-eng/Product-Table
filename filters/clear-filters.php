<?php
$label = ! empty( $elem['clearLabel'] ) ? sanitize_text_field( $elem['clearLabel'] ) : 'Clear filters';

$clear_filter = '<div class="awcpt-filter awcpt-clr-filter-wrap">';
$clear_filter .= '<a href="#" class="awcpt-clear-filter">'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</a>';
$clear_filter .= '</div>';

echo $clear_filter;
