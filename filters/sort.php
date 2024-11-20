<?php
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'dropdown';
$options = ! empty( $elem['options'] ) ? $elem['options'] : [];
$selected_val = '';

// Handling selected value from URL
if( ! empty( $_GET[$table_id . '_order_by'] ) ) {
    $selected_val = sanitize_text_field( $_GET[$table_id . '_order_by'] );
}

$sort_html = '<div class="awcpt-filter awcpt-sortby-wrap">';
if( $display_as === 'dropdown' ) {
    $sort_html .= '<select name="sort_by" class="awcpt-dropdown awcpt-filter-fld awcpt-sort-by" data-placeholder="'. esc_attr__( 'Sort by', 'product-table-for-woocommerce' ) .'" data-type="order_by">';
    $sort_html .= '<option value="" disabled selected>'. esc_html__( 'Sort by', 'product-table-for-woocommerce' ) .'</option>';
    
    foreach( $options as $key => $option ) {
        if( ! empty( $option['status'] ) && $option['status'] ) {
            $label = ! empty( $option['label'] ) ? sanitize_text_field( $option['label'] ) : '';
            $selected = selected( $selected_val, $key, false ); // Use WordPress function to handle selected attribute
            $sort_html .= '<option value="'. esc_attr( $key ) .'" '.$selected.'>'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</option>';
        }
    }
    $sort_html .= '</select>';
} else {
    return;
}
$sort_html .= '</div>';

echo $sort_html;
