<?php
$product_type = $product->get_type();
$product_id = isset($prd_data['id']) ? absint($prd_data['id']) : 0; // Sanitize the product ID
$disabled = '';

if ( in_array($product_type, ['grouped', 'variable', 'external'], true) || 
     ( !in_array($prd_data['stock_status'], ['instock', 'onbackorder'], true) ) ) {
    $disabled = '';
}


if ($product->get_type() === 'grouped' || $product->get_type() === 'variable') {
    if ($product->get_attributes()) {
        $disabled="disabled";
        error_log(print_r($product_id, true));
    }
}

$checkbox_html = '<div class="awcpt-product-checkbox-wrp">';
$checkbox_html .= '<label for="awcpt-product-checkbox-' . esc_attr($key) . '-' . esc_attr($product_id) . '" class="awcpt-prdcheck-label">';
$checkbox_html .= '<input type="checkbox" name="awcpt_product_checkbox[]" id="awcpt-product-checkbox-' . esc_attr($key) . '-' . esc_attr($product_id) . '" class="awcpt-product-checkbox" value="' . esc_attr($product_id) . '" ' . $disabled . ' />';
$checkbox_html .= '<span></span>';
$checkbox_html .= '</label>';
$checkbox_html .= '</div>';

echo $checkbox_html;
