<?php
$tbl_head = '<thead>';
$tbl_head .= '<tr>';
foreach( $this->table_cols as $column ){
	$custom_style = '';
	$custom_class = 'awcpt-table-col awcpt-' . esc_attr( $column['id'] ) . '-col';
	$col_width = $column['colWidth'];
	$col_width_unit = $column['colWidthUnit'];

	if( ! empty( $col_width ) ){
		$custom_style = 'style="width:' . esc_attr( $col_width . $col_width_unit ) . '"';
	}

	// backend custom class
	if( ! empty( $column['additionalClass'] ) ){
		$custom_class .= ' ' . esc_attr( $column['additionalClass'] );
	}

	// responsive visibility classes
	if( ! empty( $responsive_mode ) && $responsive_mode == 'manual' ){
		if( ! $column['displayTablet'] ) {
			$custom_class .= ' awcpt-hide-tablet';
		}

		if( ! $column['displayMobile'] ) {
			$custom_class .= ' awcpt-hide-mobile';
		}
	}

	$tbl_head .= '<th class="' . esc_attr( $custom_class ) . '" ' . $custom_style . '>';
	if( $column['id'] == 'prdCheckbox' ){
		$tbl_head .= '<div class="awcpt-product-checkbox-wrp">';
		$tbl_head .= '<label for="awcpt-universal-checkbox" class="awcpt-prdcheck-label">';
		$tbl_head .= esc_html__( $column['columnLabel'], 'product-table-for-woocommerce' );
		$tbl_head .= '<input type="checkbox" name="awcpt_universal_checkbox" id="awcpt-universal-checkbox" class="awcpt-universal-checkbox" />';
		$tbl_head .= '<span></span>';
		$tbl_head .= '</label>';
		$tbl_head .= '</div>';
	} else {
		$tbl_head .= esc_html__( $column['columnLabel'], 'product-table-for-woocommerce' );
	}
	$tbl_head .= '</th>';
}
$tbl_head .= '</tr>';
$tbl_head .= '</thead>';

echo $tbl_head;
