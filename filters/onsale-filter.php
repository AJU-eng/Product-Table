<?php
// Retrieve the label for the filter, defaulting to 'Sale' if not set
$label = ! empty( $elem['fldLabel'] ) ? sanitize_text_field( $elem['fldLabel'] ) : 'Sale';
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'dropdown';
$onsale_lbl = ! empty( $elem['onSaleLabel'] ) ? sanitize_text_field( $elem['onSaleLabel'] ) : 'On sale';
$any_sale_lbl = ! empty( $elem['anySaleText'] ) ? sanitize_text_field( $elem['anySaleText'] ) : 'Any';
$selected_val = '';

// Handling selected value from URL, sanitizing it
if ( ! empty( $_GET[$table_id . '_onsale'] ) ) {
    $selected_val = sanitize_text_field( $_GET[$table_id . '_onsale'] );
}

// Initialize the onsale filter output
$onsale_filter = '<div class="awcpt-filter awcpt-onsale-filter-wrap">';

// Check the display type and generate appropriate HTML
if ( $display_as == 'dropdown' ) {
    $onsale_filter .= '<select name="onsale_filter" class="awcpt-dropdown awcpt-filter-fld awcpt-onsale-filter" data-placeholder="'. esc_attr__( $label, 'product-table-for-woocommerce' ) .'" data-type="onsale">';
    $onsale_filter .= '<option value="" disabled selected>'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</option>';

    // Check if "On Sale" option should be selected
    $selected = ( $selected_val === 'true' ) ? 'selected' : '';
    $onsale_filter .= '<option value="true" '.$selected.'>'. esc_html__( $onsale_lbl, 'product-table-for-woocommerce' ) .'</option>';

    // Check if "Any" option should be selected
    $selected = ( $selected_val === 'any' ) ? 'selected' : '';
    $onsale_filter .= '<option value="any" '.$selected.'>'. esc_html__( $any_sale_lbl, 'product-table-for-woocommerce' ) .'</option>';
    $onsale_filter .= '</select>';
} else {
    $onsale_filter .= '<div class="awcpt-filter-row-heading">';
    $onsale_filter .= esc_html__( $label, 'product-table-for-woocommerce' );
    $onsale_filter .= '</div>';
    $onsale_filter .= '<div class="awcpt-filter-row-grp">';

    // Check if the "On Sale" checkbox should be checked
    $checked = ( $selected_val === 'true' ) ? 'checked="checked"' : '';
    $onsale_filter .= '<div class="awcpt-filter-row">';
    $onsale_filter .= '<label for="awcpt-filter-onsale" class="awcpt-checkbox-label">';
    $onsale_filter .= esc_html__( $onsale_lbl, 'product-table-for-woocommerce' );
    $onsale_filter .= '<input type="checkbox" name="onsale_filter" class="awcpt-filter-checkbox awcpt-filter-fld awcpt-onsale-filter" id="awcpt-filter-onsale" data-type="onsale" value="true" '.$checked.' />';
    $onsale_filter .= '<span></span>';
    $onsale_filter .= '</label>';
    $onsale_filter .= '</div>';
    $onsale_filter .= '</div>';
}

// Close the filter div
$onsale_filter .= '</div>';

// Output the filter
echo $onsale_filter;
