<?php
$label = ! empty( $elem['fldLabel'] ) ? sanitize_text_field( $elem['fldLabel'] ) : 'Rating';
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'dropdown';
$any_rate_lbl = ! empty( $elem['anyRateText'] ) ? sanitize_text_field( $elem['anyRateText'] ) : 'Show all';
$selected_val = array();

// handling selected val url
if( ! empty( $_GET[$table_id . '_rated'] ) ){
    $selected_val_str = sanitize_text_field( $_GET[$table_id . '_rated'] );
    if( $selected_val_str ){
        $selected_val = array_map( 'sanitize_text_field', explode( ",", $selected_val_str ) );
    }
}

$rating_filter = '<div class="awcpt-filter awcpt-rating-filter-wrap">';
if( $display_as == 'dropdown' ) {
    $rating_filter .= '<select name="rating_filter" class="awcpt-dropdown awcpt-filter-fld awcpt-rating-filter" data-placeholder="'. esc_attr__( $label, 'product-table-for-woocommerce' ) .'" data-type="rating">';
    $rating_filter .= '<option value="" disabled selected>'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</option>';

    for ($i = 1; $i <= 5; $i++) {
        $selected = in_array( (string)$i, $selected_val, true ) ? 'selected' : '';
        $rating_filter .= '<option value="'. esc_attr( $i ) .'" '.$selected.'>'. esc_html( $i ) .'</option>';
    }

    $selected = in_array( "any", $selected_val, true ) ? 'selected' : '';
    $rating_filter .= '<option value="any" '.$selected.'>'. esc_html__( $any_rate_lbl, 'product-table-for-woocommerce' ) .'</option>';
    $rating_filter .= '</select>';
} else {
    $rating_filter .= '<div class="awcpt-filter-row-heading">';
    $rating_filter .= esc_html__( $label, 'product-table-for-woocommerce' );
    $rating_filter .= '</div>';
    $rating_filter .= '<div class="awcpt-filter-row-grp">';

    for ($i = 1; $i <= 5; $i++) {
        $checked = in_array( (string)$i, $selected_val, true ) ? 'checked="checked"' : '';
        $rating_filter .= '<div class="awcpt-filter-row">';
        $rating_filter .= '<label for="awcpt-rating'.$i.'" class="awcpt-checkbox-label">';
        $rating_filter .= esc_html__( 'Rated', 'product-table-for-woocommerce' ) . ' ' . esc_html( $i );
        $rating_filter .= '<input type="checkbox" name="rating_filter[]" class="awcpt-filter-checkbox awcpt-filter-fld awcpt-rating-filter" id="awcpt-rating'.$i.'" data-type="rating" value="'. esc_attr( $i ) .'" '.$checked.' />';
        $rating_filter .= '<span></span>';
        $rating_filter .= '</label>';
        $rating_filter .= '</div>';
    }
    $rating_filter .= '</div>';
}
$rating_filter .= '</div>';

echo $rating_filter;
