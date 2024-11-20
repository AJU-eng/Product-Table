<?php
$label = ! empty( $elem['fldLabel'] ) ? sanitize_text_field( $elem['fldLabel'] ) : 'Availability';
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'dropdown';
$instock_lbl = ! empty( $elem['inStockLabel'] ) ? sanitize_text_field( $elem['inStockLabel'] ) : 'In stock';
$out_stock_lbl = ! empty( $elem['outStockLabel'] ) ? sanitize_text_field( $elem['outStockLabel'] ) : 'Out of stock';
$any_stock_label = ! empty( $elem['anyStatusText'] ) ? sanitize_text_field( $elem['anyStatusText'] ) : 'Any';
$selected_val = array();

// Handling selected val URL
if( ! empty( $_GET[$table_id . '_stock_status'] ) ){
    $selected_val_str = sanitize_text_field( $_GET[$table_id . '_stock_status'] );
    if( $selected_val_str ){
        $selected_val = explode( ",", $selected_val_str );
    }
}

$availability_filter = '<div class="awcpt-filter awcpt-availability-filter-wrap">';
if( $display_as == 'dropdown' ) {
    $availability_filter .= '<select name="availability_filter" class="awcpt-filter-fld awcpt-dropdown awcpt-availability-filter" data-placeholder="'. esc_attr__( $label, 'product-table-for-woocommerce' ) .'" data-type="availability">';
    $availability_filter .= '<option value="" selected disabled>'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</option>';

    // In stock option
    $selected = in_array( "instock", $selected_val ) ? 'selected' : '';
    $availability_filter .= '<option value="instock" '.$selected.'>'. esc_html__( $instock_lbl, 'product-table-for-woocommerce' ) .'</option>';

    // Out of stock option
    $selected = in_array( "outofstock", $selected_val ) ? 'selected' : '';
    $availability_filter .= '<option value="outofstock" '.$selected.'>'. esc_html__( $out_stock_lbl, 'product-table-for-woocommerce' ) .'</option>';

    // Any option
    $selected = in_array( "any", $selected_val ) ? 'selected' : '';
    $availability_filter .= '<option value="any" '.$selected.'>'. esc_html__( $any_stock_label, 'product-table-for-woocommerce' ) .'</option>';
    $availability_filter .= '</select>';
} else {
    $availability_filter .= '<div class="awcpt-filter-row-heading">';
    $availability_filter .= esc_html__( $label, 'product-table-for-woocommerce' );
    $availability_filter .= '</div>';

    $availability_filter .= '<div class="awcpt-filter-row-grp">';

    // In stock checkbox
    $checked = in_array( "instock", $selected_val ) ? 'checked="checked"' : '';
    $availability_filter .= '<div class="awcpt-filter-row">';
    $availability_filter .= '<label for="awcpt-filter-instock" class="awcpt-checkbox-label">';
        $availability_filter .= esc_html__( $instock_lbl, 'product-table-for-woocommerce' );
        $availability_filter .= '<input type="checkbox" name="availability_filter[]" class="awcpt-filter-fld awcpt-filter-checkbox awcpt-availability-filter" id="awcpt-filter-instock" data-type="availability" value="instock" '.$checked.' />';
        $availability_filter .= '<span></span>';
    $availability_filter .= '</label>';
    $availability_filter .= '</div>';

    // Out of stock checkbox
    $checked = in_array( "outofstock", $selected_val ) ? 'checked="checked"' : '';
    $availability_filter .= '<div class="awcpt-filter-row">';
    $availability_filter .= '<label for="awcpt-filter-outofstock" class="awcpt-checkbox-label">';
        $availability_filter .= esc_html__( $out_stock_lbl, 'product-table-for-woocommerce' );
        $availability_filter .= '<input type="checkbox" name="availability_filter[]" class="awcpt-filter-fld awcpt-filter-checkbox awcpt-availability-filter" id="awcpt-filter-outofstock" data-type="availability" value="outofstock" '.$checked.' />';
        $availability_filter .= '<span></span>';
    $availability_filter .= '</label>';
    $availability_filter .= '</div>';

    $availability_filter .= '</div>';
}
$availability_filter .= '</div>';

echo $availability_filter;
