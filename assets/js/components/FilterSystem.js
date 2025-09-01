// assets/js/components/FilterSystem.js
class FilterSystem {
    constructor(containerId, filtersConfig) {
        this.container = document.getElementById(containerId);
        this.filtersConfig = filtersConfig;
        this.currentFilters = {};
        this.onFilterChange = null;
    }

    render() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="filters">
                <h3 class="filters-title"><i class="fa-solid fa-filter"></i> Filtres</h3>
                <div class="filters-grid">
                    ${this.filtersConfig.map(filter => this.renderFilterGroup(filter)).join('')}
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderFilterGroup(filter) {
        return `
            <div class="filter-group">
                <label class="filter-label">${filter.label}</label>
                <select class="filter-select" id="filter-${filter.key}">
                    <option value="all">Tous</option>
                    ${filter.options.map(option => `
                        <option value="${option.value}">${option.label}</option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    attachEvents() {
        this.filtersConfig.forEach(filter => {
            const select = document.getElementById(`filter-${filter.key}`);
            if (select) {
                select.addEventListener('change', (e) => {
                    this.currentFilters[filter.key] = e.target.value;
                    if (this.onFilterChange) {
                        this.onFilterChange(this.currentFilters);
                    }
                });
            }
        });
    }

    getFilters() {
        return this.currentFilters;
    }

    setFilterChangeCallback(callback) {
        this.onFilterChange = callback;
    }
}