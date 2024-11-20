<?php
echo '<div class="awcpt-nav awcpt-head-left-nav">';

if ( ! empty( $nav_head_left_elems ) ) {
    foreach( $nav_head_left_elems as $elem ) {
        // Sanitize the element ID before using it
        $elem_id = isset($elem['id']) ? sanitize_key($elem['id']) : '';

        // Check if the sanitized element ID is valid before including files
        switch ( $elem_id ) {
            case 'sortBy':
                include( $this->filters_dir . '/sort.php' );
                break;
            case 'resultCount':
                include( $this->filters_dir . '/result-count.php' );
                break;
            case 'resultPerPage':
                include( $this->filters_dir . '/results-per-page.php' );
                break;
            case 'catFilter':
                include( $this->filters_dir . '/category-filter.php' );
                break;
            case 'priceFilter':
                include( $this->filters_dir . '/price-filter.php' );
                break;
            case 'search':
                include( $this->filters_dir . '/search.php' );
                break;
            case 'availabilityFilter':
                include( $this->filters_dir . '/availability-filter.php' );
                break;
            case 'onSaleFilter':
                include( $this->filters_dir . '/onsale-filter.php' );
                break;
            case 'ratingFilter':
                include( $this->filters_dir . '/rating-filter.php' );
                break;
            case 'clearFilters':
                include( $this->filters_dir . '/clear-filters.php' );
                break;
            case 'cHtml':
                include( $this->filters_dir . '/html-filter.php' );
                break;
            default:
                return;
        }
    }
}

echo '</div>';
