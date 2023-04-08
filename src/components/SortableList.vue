<template>
    <div class="row">
        <div class="col-1"></div>
        <div class="col-10 col-md-2">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchString">
        </div>
    </div>
    <div class="sortable-list" ref="sortableList">
        <component :is="element" v-for="ssItem in sortedShownItems" :data="ssItem" v-bind:key="ssItem.id"></component>
    </div>
</template>
  
<script>
/* eslint-disable no-unused-vars */
import ProductTile from './ProductTile.vue'
import CompanyTile from './CompanyTile.vue'
/* eslint-enable no-unused-vars */

export default {
    name: "SortableList",
    data() {
        return {
            categories: [],
            chosenCategories: [],
            searchString: "",
            shownItems: [],
            sortedShownItems: [],
            sortBy: "name", //empty string if no sort is needed
            dir: "up", //or 'down'
        };
    },
    props: ["items", "element"],
    methods: {
        sort: function () {
            this.sortedShownItems = this.shownItems;
            if (this.sortBy == "")
                return;
            this.sortedShownItems.sort((a, b) => {
                if (typeof a[this.sortBy] == "string" && typeof b[this.sortBy] == "string")
                    return a[this.sortBy].localeCompare(b[this.sortBy]);
                if (a[this.sortBy] > b[this.sortBy])
                    return 1;
                if (a[this.sortBy] < b[this.sortBy])
                    return -1;
                else
                    return 0;
            });
            if (this.dir == "down")
                this.sortedShownItems.reverse();
            return;
        },
        searchForString: function (string, object) {
            if (object == null)
                return 0;
            let instances = 0;
            if (typeof object == "object") {
                if (!(object instanceof Array)) {
                    object = Object.values(object);
                }
                for (let i = 0; i < object.length; i++) {
                    instances += this.searchForString(string, object[i]);
                }
                return instances;
            }
            if (typeof object != "string")
                return 0;
            let match = object.match(new RegExp(string, "gi"));
            if (match == null)
                return 0;
            return match.length;
        },
        generateShownItems: function () {
            let newShownItems = [];
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                let matches = true;
                if (this.searchForString(this.searchString, item) == 0)
                    matches = false;
                if (item.categories == null && this.chosenCategories.length != 0) {
                    matches = false;
                }
                else {
                    for (let j = 0; j < this.chosenCategories.length; j++) {
                        if (!item.categories.includes(this.chosenCategories[j]))
                            matches = false;
                    }
                }
                if (matches)
                    newShownItems.push(item);
            }
            if (newShownItems != this.shownItems) {
                this.shownItems = newShownItems;
                this.sort();
            }
        },
        generateCategories: function () {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item.categories == null)
                    continue;
                for (let j = 0; j < item.categories.length; j++) {
                    let category = item.categories[j];
                    if (!this.categories.includes(category))
                        this.categories.push(category);
                }
            }
        }
    },
    mounted() {
        this.generateCategories();
        this.generateShownItems();
    },
    watch: {
        items: function () {
            this.generateCategories();
            this.generateShownItems();
        },
        element: function () {
            this.generateShownItems();
        },
        searchString: function () {
            this.generateShownItems();
        },
        dir: function () {
            this.generateShownItems();
        },
        sortBy: function () {
            this.generateShownItems();
        }
    },
    components: { ProductTile, CompanyTile }
}
</script>

<style scoped>

    

</style>