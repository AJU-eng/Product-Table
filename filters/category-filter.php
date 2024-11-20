<?php
$label = ! empty( $elem['fldLabel'] ) ? sanitize_text_field( $elem['fldLabel'] ) : 'Category';
$display_as = ! empty( $elem['display'] ) ? sanitize_text_field( $elem['display'] ) : 'dropdown';
$hide_empty = ! empty( $elem['hideEmpty'] ) ? (bool) $elem['hideEmpty'] : false;
$multi_select = ! empty( $elem['multiSelect'] ) ? (bool) $elem['multiSelect'] : false;
$exclude = ! empty( $elem['exclude'] ) ? sanitize_text_field( $elem['exclude'] ) : '';
$exclude_array = ! empty( $exclude ) ? array_map( 'intval', explode( ",", $exclude ) ) : [];
$any_cat_label = ! empty( $elem['anyCatText'] ) ? sanitize_text_field( $elem['anyCatText'] ) : 'Any';
$selected_val = [];

// Handling selected val URL
if( ! empty( $_GET[$table_id . '_categories'] ) ){
    $selected_val_str = sanitize_text_field( $_GET[$table_id . '_categories'] );
    if( $selected_val_str ){
        $selected_val = array_map( 'intval', explode( ",", $selected_val_str ) );
    }
}

// Getting categories
$prd_cats = get_terms( array(
    'taxonomy' => 'product_cat',
    'orderby' => 'name',
    'hide_empty' => $hide_empty,
    'fields' => 'id=>name',
    'number' => 0
));

if( $prd_cats && !is_wp_error($prd_cats) ){
    $cat_html = '<div class="awcpt-filter awcpt-catfilter-wrap">';
    if( $display_as == 'dropdown' ) {
        $multi_select_attr = $multi_select ? 'multiple' : '';
        $select_class = 'awcpt-dropdown awcpt-filter-fld awcpt-cat-filter' . ($multi_select ? ' awcpt-multi-select' : '');

        $cat_html .= '<select name="cat_filter" class="'. esc_attr( $select_class ) .'" data-type="category" '.$multi_select_attr.' data-placeholder="'. esc_attr__( $label, 'product-table-for-woocommerce' ) .'">';
        if( ! $multi_select ){
            $cat_html .= '<option value="" selected disabled>'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</option>';
        }
        
        foreach( $prd_cats as $id => $name ){
            if( empty( $exclude_array ) || ! in_array( $id, $exclude_array ) ) {
                $selected = in_array( $id, $selected_val ) ? 'selected' : '';
                $cat_html .= '<option value="'. esc_attr( $id ) .'" '.$selected.'>'. esc_html( $name ) .'</option>';
            }
        }

        if( ! $multi_select ){
            $selected = in_array( "any", $selected_val ) ? 'selected' : '';
            $cat_html .= '<option value="any" '.$selected.'>'. esc_html__( $any_cat_label, 'product-table-for-woocommerce' ) .'</option>';
        }

        $cat_html .= '</select>';
    } else {
        $cat_html .= '<div class="awcpt-filter-row-heading">'. esc_html__( $label, 'product-table-for-woocommerce' ) .'</div>';
        $cat_html .= '<div class="awcpt-filter-row-grp">';

        foreach( $prd_cats as $id => $name ){
            if( empty( $exclude_array ) || ! in_array( $id, $exclude_array ) ) {
                $checked = in_array( $id, $selected_val ) ? 'checked="checked"' : '';
                
                if( $multi_select ){
                    $cat_html .= '<div class="awcpt-filter-row">';
                    $cat_html .= '<label for="awcpt-cat-filter'.$id.'" class="awcpt-checkbox-label">';
                        $cat_html .= esc_html( $name );
                        $cat_html .= '<input type="checkbox" name="cat_filter[]" class="awcpt-filter-checkbox awcpt-filter-fld awcpt-cat-filter" id="awcpt-cat-filter'.$id.'" data-type="category" value="'. esc_attr( $id ) .'" '.$checked.' />';
                        $cat_html .= '<span></span>';
                    $cat_html .= '</label>';
                    $cat_html .= '</div>';
                } else {
                    $cat_html .= '<div class="awcpt-filter-row">';
                    $cat_html .= '<label for="awcpt-cat-filter'.$id.'" class="awcpt-radio-label">';
                        $cat_html .= esc_html( $name );
                        $cat_html .= '<input type="radio" name="cat_filter" class="awcpt-filter-radio awcpt-filter-fld awcpt-cat-filter" id="awcpt-cat-filter'.$id.'" data-type="category" value="'. esc_attr( $id ) .'" '.$checked.' />';
                        $cat_html .= '<span></span>';
                    $cat_html .= '</label>';
                    $cat_html .= '</div>';
                }
            }
        }

        if( ! $multi_select ){
            // $checked = in_array( "any", $selected_val ) ? 'checked="checked"' : 'checked="checked"';
            $cat_html .= '<div class="awcpt-filter-row">';
            $cat_html .= '<label for="awcpt-cat-filter-any" class="awcpt-radio-label">';
                $cat_html .= esc_html__( $any_cat_label, 'product-table-for-woocommerce' );
                $cat_html .= '<input type="radio" name="cat_filter" class="awcpt-filter-radio awcpt-filter-fld awcpt-cat-filter" id="awcpt-cat-filter-any" data-type="category" value="any" checked />';
                $cat_html .= '<span></span>';
            $cat_html .= '</label>';
            $cat_html .= '</div>';
        }
        $cat_html .= '</div>';
    }
    $cat_html .= '</div>';

    echo $cat_html;
} else {
    return;
}
