<?php
$hide_sold_individually = isset($column['hideSoldIndividually']) ? (bool) $column['hideSoldIndividually'] : false;
if ( $hide_sold_individually && $product->is_sold_individually() ) {
    return;
}

$display_field = isset($column['displayField']) ? sanitize_key($column['displayField']) : '';
$input_value = apply_filters( 'woocommerce_quantity_input_min', 1, $product );
$min_value = apply_filters( 'woocommerce_quantity_input_min', 0, $product );
$max_value = apply_filters( 'woocommerce_quantity_input_max', -1, $product );
$step = apply_filters( 'woocommerce_quantity_input_step', 1, $product );
$max_quantity = ! empty( $column['maxQty'] ) ? intval( $column['maxQty'] ) : $max_value;

$quantity_html = '<div class="awcpt-quantity-wrap">';
// error_log(print_r($display_field,true));
if ( $display_field === 'inputnumber' ) {
    $quantity_html .= '<div class="awcpt-qty-field">';
    $quantity_html .= '<input type="number" name="awcpt_qty" class="awcpt-quantity" step="' . esc_attr( $step ) . '" min="' . esc_attr( $min_value ) . '" max="' . esc_attr( $max_quantity ) . '" value="1" />';
    $quantity_html .= '</div>';
} else {
    $dropdown_label = isset($column['dropdownLabel']) ? esc_html__( $column['dropdownLabel'], 'product-table-for-woocommerce' ) : '';

    $quantity_html .= '<div class="awcpt-qty-field awcpt-qty-select-wrap">';
    $quantity_html .= '<select name="awcpt_qty" class="awcpt-quantity awcpt-qty-select">';
    $quantity_html .= '<option value="' . esc_attr( $min_value ) . '">' . esc_html( $dropdown_label ) . esc_html( $min_value ) . '</option>';
    
    $v = $min_value;
    while ( $v < $max_quantity ) {
        $v += $step;
        $quantity_html .= '<option value="' . esc_attr( $v ) . '">' . esc_html( $v ) . '</option>';
    }
    $quantity_html .= '</select>';
    $quantity_html .= '</div>';
}
$quantity_html .= '</div>';

echo $quantity_html;
