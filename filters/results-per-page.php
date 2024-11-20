<?php
$label = ! empty( $elem['optionLabel'] ) ? sanitize_text_field( $elem['optionLabel'] ) : '{limit} per page';
$limit = ! empty( $elem['maxLimit'] ) ? (int) $elem['maxLimit'] : 20;
$start = ! empty( $elem['initialVal'] ) ? (int) $elem['initialVal'] : 1;
$step = ! empty( $elem['incrementBy'] ) ? (int) $elem['incrementBy'] : 1;
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'row';
$selected_val = '';

// Handling selected value from URL
if( ! empty( $_GET[$table_id . '_results_per_page'] ) ) {
    $selected_val = sanitize_text_field( $_GET[$table_id . '_results_per_page'] );
}

$results_html = '<div class="awcpt-filter awcpt-results-per-page-wrap">';
if( $display_as == 'dropdown' ) {
    $results_html .= '<select name="results_per_page" class="awcpt-dropdown awcpt-filter-fld awcpt-results-per-page" data-placeholder="'. esc_attr__( 'Results per page', 'product-table-for-woocommerce' ) .'" data-type="results_per_page">';
    $results_html .= '<option value="" disabled selected>'. esc_html__( 'Results per page', 'product-table-for-woocommerce' ) .'</option>';

    $c = $start;
    $flag = true;
    while( $c <= $limit ) {
        // Including posts per page
        if( ! empty( $products_per_page ) && ( $products_per_page < $c ) && $flag ) {
            $flag = false;
            $fld_label = str_replace( '{limit}', esc_html( $products_per_page ), $label );
            $results_html .= '<option value="'. esc_attr( $products_per_page ) .'" selected>'. esc_html__( $fld_label, 'product-table-for-woocommerce' ) .'</option>';
        }

        // Options
        if( $products_per_page != $c ) {
            $fld_label = str_replace( '{limit}', esc_html( $c ), $label );
            $selected = ($selected_val == $c) ? 'selected' : '';
            $results_html .= '<option value="'. esc_attr( $c ) .'" '.$selected.'>'. esc_html__( $fld_label, 'product-table-for-woocommerce' ) .'</option>';
        }
        $c += $step;
    }
    $results_html .= '</select>';
} else {
    $results_html .= '<div class="awcpt-filter-row-heading">';
    $results_html .= esc_html__( 'Results per page', 'product-table-for-woocommerce' );
    $results_html .= '</div>';
    $results_html .= '<div class="awcpt-filter-row-grp">';

    $c = $start;
    $flag = true;
    while( $c <= $limit ) {
        // Including posts per page
        if( ! empty( $products_per_page ) && ( $products_per_page < $c ) && $flag ) {
            $flag = false;
            $fld_label = str_replace( '{limit}', esc_html( $products_per_page ), $label );
            $results_html .= '<div class="awcpt-filter-row">';
            $results_html .= '<label for="awcpt-results-per-page'. esc_attr( $products_per_page ) .'" class="awcpt-radio-label">';
            $results_html .= esc_html__( $fld_label, 'product-table-for-woocommerce' );
            $results_html .= '<input type="radio" name="results_per_page" class="awcpt-filter-radio awcpt-filter-fld awcpt-results-per-page" id="awcpt-results-per-page'. esc_attr( $products_per_page ) .'" data-type="results_per_page" value="'. esc_attr( $products_per_page ) .'" checked="checked" />';
            $results_html .= '<span></span>';
            $results_html .= '</label>';
            $results_html .= '</div>';
        }

        // Options
        if( $products_per_page != $c ) {
            $fld_label = str_replace( '{limit}', esc_html( $c ), $label );
            $checked = ($selected_val == $c) ? 'checked="checked"' : '';
            $results_html .= '<div class="awcpt-filter-row">';
            $results_html .= '<label for="awcpt-results-per-page'. esc_attr( $c ) .'" class="awcpt-radio-label">';
            $results_html .= esc_html__( $fld_label, 'product-table-for-woocommerce' );
            $results_html .= '<input type="radio" name="results_per_page" class="awcpt-filter-radio awcpt-filter-fld awcpt-results-per-page" id="awcpt-results-per-page'. esc_attr( $c ) .'" data-type="results_per_page" value="'. esc_attr( $c ) .'" '.$checked.' />';
            $results_html .= '<span></span>';
            $results_html .= '</label>';
            $results_html .= '</div>';
        }
        $c += $step;
    }
    $results_html .= '</div>';
}
$results_html .= '</div>';

echo $results_html;
