<?php
// Sanitize and set default values for the filter labels and settings
$label = ! empty( $elem['fldLabel'] ) ? sanitize_text_field( $elem['fldLabel'] ) : 'Price range';
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'dropdown';
$initial_price = ( isset( $elem['initialVal'] ) && $elem['initialVal'] !== '' ) ? floatval( $elem['initialVal'] ) : 0;
$max_price = ( isset( $elem['maxVal'] ) && $elem['maxVal'] !== '' ) ? floatval( $elem['maxVal'] ) : 50;
$step = ! empty( $elem['incrementBy'] ) ? intval( $elem['incrementBy'] ) : 10;
$any_price_label = ! empty( $elem['anyPriceText'] ) ? sanitize_text_field( $elem['anyPriceText'] ) : 'Any price';
$custom_input = ! empty( $elem['inputBox'] ) ? $elem['inputBox'] : false;
$min_input_lbl = 'Min';
$max_input_lbl = 'Max';
$separator_label = 'to';
$btn_label = 'GO';
$selected_val = '';

// Handle the selected value from the URL and sanitize it
if ( ! empty( $_GET[$table_id . '_price_range'] ) ) {
    $selected_val = sanitize_text_field( $_GET[$table_id . '_price_range'] );
}

// Initialize the price filter output
$price_filter = '<div class="awcpt-filter awcpt-price-filter-wrap">';

// Generate dropdown or radio button filters based on the display type
if ( $display_as === 'dropdown' ) {
    $min = $initial_price;
    $max = $initial_price + $step;

    $price_filter .= '<select name="price_filter" class="awcpt-dropdown awcpt-filter-fld awcpt-price-filter" data-placeholder="'. esc_attr__( $label, 'product-table-for-woocommerce' ) .'" data-type="price">';
    $price_filter .= '<option value="" disabled selected>'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</option>';

    while ( $max <= $max_price ) {
        $val = $min . '-' . $max;
        $lbl = strip_tags( wc_price( $min, array( 'decimals' => 0 ) ) ) . ' - ' . strip_tags( wc_price( $max, array( 'decimals' => 0 ) ) );
        $selected = ( $selected_val === $val ) ? 'selected' : '';

        $price_filter .= '<option value="'. esc_attr( $val ) .'" '.$selected.'>'. esc_html( $lbl ) .'</option>';

        // Incrementing ranges
        $min = $max + 1;
        $max = $max + $step;
    }

    $selected = ( $selected_val === 'any' ) ? 'selected' : '';
    $price_filter .= '<option value="any" '.$selected.'>'. esc_html__( $any_price_label, 'product-table-for-woocommerce' ) .'</option>';
    $price_filter .= '</select>';
} else {
    $min = $initial_price;
    $max = $initial_price + $step;
    $price_filter .= '<div class="awcpt-filter-row-heading">'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</div>';
    $price_filter .= '<div class="awcpt-filter-row-grp">';

    while ( $max <= $max_price ) {
        $val = $min . '-' . $max;
        $lbl = strip_tags( wc_price( $min, array( 'decimals' => 0 ) ) ) . ' - ' . strip_tags( wc_price( $max, array( 'decimals' => 0 ) ) );
        $checked = ( $selected_val === $val ) ? 'checked="checked"' : '';

        $price_filter .= '<div class="awcpt-filter-row">';
        $price_filter .= '<label for="awcpt-price-filter'.$val.'" class="awcpt-radio-label">';
        $price_filter .= esc_html( $lbl );
        $price_filter .= '<input type="radio" name="price_filter" class="awcpt-filter-radio awcpt-filter-fld awcpt-price-filter" id="awcpt-price-filter'.$val.'" data-type="price" value="'. esc_attr( $val ) .'" '.$checked.' />';
        $price_filter .= '<span></span>';
        $price_filter .= '</label>';
        $price_filter .= '</div>';

        // Incrementing ranges
        $min = $max + 1;
        $max = $max + $step;
    }

    $checked = ( $selected_val === 'any' ) ? 'checked="checked"' : '';
    $price_filter .= '<div class="awcpt-filter-row">';
    $price_filter .= '<label for="awcpt-price-filter-any" class="awcpt-radio-label">';
    $price_filter .= esc_html__( $any_price_label, 'product-table-for-woocommerce' );
    $price_filter .= '<input type="radio" name="price_filter" class="awcpt-filter-radio awcpt-filter-fld awcpt-price-filter" id="awcpt-price-filter-any" data-type="price" value="any" '.$checked.' />';
    $price_filter .= '<span></span>';
    $price_filter .= '</label>';
    $price_filter .= '</div>';

    // Add custom input fields if enabled
    if ( $custom_input ) {
        $price_filter .= '<div class="awcpt-price-range-wrap">';
        $price_filter .= '<input type="number" class="awcpt-price-input-min" name="min_price" placeholder="'. esc_attr__( $min_input_lbl, 'product-table-for-woocommerce' ) .'" min="0" />';
        $price_filter .= '<span class="awcpt-price-range-separator">'. esc_html__( $separator_label, 'product-table-for-woocommerce' ) .'</span>';
        $price_filter .= '<input type="number" class="awcpt-price-input-max" name="max_price" placeholder="'. esc_attr__( $max_input_lbl, 'product-table-for-woocommerce' ) .'" min="1" />';
        $price_filter .= '<a href="#" class="awcpt-button awcpt-price-range-btn">'. esc_html__( $btn_label, 'product-table-for-woocommerce' ) .'</a>';
        $price_filter .= '</div>';
    }
    $price_filter .= '</div>';
}

// Close the price filter div
$price_filter .= '</div>';

// Output the price filter
echo $price_filter;
