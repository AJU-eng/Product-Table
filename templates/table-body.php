<?php
$prd_data = $product->get_data();
$in_cart = awcpt_get_cart_item_quantity( $prd_data['id'] );

echo '<tr class="awcpt-row" data-id="' . esc_attr( $prd_data['id'] ) . '" data-cart-in="' . esc_attr( $in_cart ) . '">';
foreach( $this->table_cols as $key => $column ){
	$custom_style = '';
	$custom_class = 'awcpt-table-col awcpt-' . esc_attr( $column['id'] ) . '-col';
	$col_width = $column['colWidth'];
	$col_width_unit = $column['colWidthUnit'];
	$display_tablet = $column['displayTablet'];
	$display_mobile = $column['displayMobile'];

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

	echo '<td class="' . esc_attr( $custom_class ) . '" ' . $custom_style . ' data-id="' . esc_attr( $prd_data['id'] ) . '">';

	// Include respective templates
	if( $column['id'] == 'prdTitle' ){
		include( $this->templates_dir.'/title.php' );
	} elseif( $column['id'] == 'prdImg' ){
		include( $this->templates_dir.'/product-image.php' );
	} elseif( $column['id'] == 'prdContent' ){
		include( $this->templates_dir.'/content.php' );
	} elseif( $column['id'] == 'prdExcerpt' ){
		include( $this->templates_dir.'/excerpt.php' );
	} elseif( $column['id'] == 'prdDate' ){
		include( $this->templates_dir.'/date.php' );
	} elseif( $column['id'] == 'price' ){
		include( $this->templates_dir.'/price.php' );
	} elseif( $column['id'] == 'cartForm' ){
		include( $this->templates_dir.'/cart-form.php' );
	} elseif( $column['id'] == 'rating' ){
		include( $this->templates_dir.'/rating.php' );
	} elseif( $column['id'] == 'prdAttribute' ){
		include( $this->templates_dir.'/attribute.php' );
	} elseif( $column['id'] == 'prdCats' ){
		include( $this->templates_dir.'/category.php' );
	} elseif( $column['id'] == 'prdTags' ){
		include( $this->templates_dir.'/tags.php' );
	} elseif( $column['id'] == 'prdTaxonomy' ){
		include( $this->templates_dir.'/taxonomy.php' );
	} elseif( $column['id'] == 'prdAvailability' ){
		include( $this->templates_dir.'/availability.php' );
	} elseif( $column['id'] == 'prdDimensions' ){
		include( $this->templates_dir.'/dimensions.php' );
	} elseif( $column['id'] == 'prdWeight' ){
		include( $this->templates_dir.'/weight.php' );
	} elseif( $column['id'] == 'prdQuantity' ){
		include( $this->templates_dir.'/quantity.php' );
	} elseif( $column['id'] == 'prdStock' ){
		include( $this->templates_dir.'/stock.php' );
	} elseif( $column['id'] == 'prdSku' ){
		include( $this->templates_dir.'/sku.php' );
	} elseif( $column['id'] == 'prdOnSale' ){
		include( $this->templates_dir.'/onsale.php' );
	} elseif( $column['id'] == 'slNo' ){
		include( $this->templates_dir.'/serial-number.php' );
	} elseif( $column['id'] == 'cText' ){
		include( $this->templates_dir.'/text.php' );
	} elseif( $column['id'] == 'cHtml' ){
		include( $this->templates_dir.'/html.php' );
	} elseif( $column['id'] == 'eleShortcode' ){
		include( $this->templates_dir.'/shortcode.php' );
	} elseif( $column['id'] == 'customField' ){
		include( $this->templates_dir.'/custom-field.php' );
	} elseif( $column['id'] == 'prdButton' ){
		include( $this->templates_dir.'/button.php' );
	} elseif( $column['id'] == 'prdCheckbox' ){
		include( $this->templates_dir.'/checkbox.php' );
	} elseif( $column['id'] == 'acoQuickView' ){
		include( $this->templates_dir.'/aco-quick-view.php' );
	}
	echo '</td>';
}
echo '</tr>';

