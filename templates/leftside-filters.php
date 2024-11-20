<?php 
echo '<div class="awcpt-nav awcpt-left-nav">';
foreach( $nav_sidebar_elems as $elem ){
    if( $elem['id'] == 'sortBy' ){
        include( $this->filters_dir.'/sort.php' );
    } elseif( $elem['id'] == 'resultCount' ){
        include( $this->filters_dir.'/result-count.php' );
    } elseif ( $elem['id'] == 'resultPerPage' ) {
        include( $this->filters_dir.'/results-per-page.php' );
    } elseif ( $elem['id'] == 'catFilter' ) {
        include( $this->filters_dir.'/category-filter.php' );
    } elseif ( $elem['id'] == 'priceFilter' ) {
        include( $this->filters_dir.'/price-filter.php' );
    } elseif ( $elem['id'] == 'search' ) {
        include( $this->filters_dir.'/search.php' );
    } elseif ( $elem['id'] == 'availabilityFilter' ) {
        include( $this->filters_dir.'/availability-filter.php' );
    } elseif ( $elem['id'] == 'onSaleFilter' ) {
        include( $this->filters_dir.'/onsale-filter.php' );
    } elseif ( $elem['id'] == 'ratingFilter' ) {
        include( $this->filters_dir.'/rating-filter.php' );
    } elseif ( $elem['id'] == 'clearFilters' ) {
        include( $this->filters_dir.'/clear-filters.php' );
    } elseif ( $elem['id'] == 'cHtml' ) {
        include( $this->filters_dir.'/html-filter.php' );
    } else {
        return;
    }
}
echo '</div>';