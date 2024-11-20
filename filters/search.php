<?php
$placeholder = ! empty( $elem['placeholder'] ) ? sanitize_text_field( $elem['placeholder'] ) : 'Search';
$button_lbl = ! empty( $elem['btnText'] ) ? sanitize_text_field( $elem['btnText'] ) : 'Search';
$selected_val = '';
$clear_val_style = '';

// Handling selected value from URL
if( ! empty( $_GET[$table_id . '_search'] ) ) {
    $selected_val = sanitize_text_field( $_GET[$table_id . '_search'] );
    $clear_val_style = 'style="display: block;"';
}

$search_html = '<div class="awcpt-search-wrapper">';
$search_html .= '<div class="awcpt-search-input-wrp">';
$search_html .= '<input type="search" name="awcpt_search" class="awcpt-search-input" placeholder="'. esc_attr__( $placeholder, 'product-table-for-woocommerce' ) .'" value="'. esc_attr( $selected_val ) .'" />';
$search_html .= '<span class="awcpt-search-clear" '.$clear_val_style.'>x</span>';
$search_html .= '</div>';
$search_html .= '<div class="awcpt-search-submit-wrp">';
$search_html .= '<input type="submit" name="awcpt_search_submit" class="awcpt-search-submit awcpt-search-submit-'. esc_attr( $table_id ) .'" value="'. esc_attr__( $button_lbl, 'product-table-for-woocommerce' ) .'" />';
$search_html .= '</div>';
$search_html .= '</div>';

echo $search_html;
