<template>
    <div>
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" 
                    :class="{'disabled': !getPage.has_pre}"
                >
                    <a class="page-link" href="#" aria-label="Previous"
                       @click.prevent="turnPage(getPage.current_page - 1)">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                <li class="page-item" 
                    v-for="page in getPage.total_pages" :key="page"
                    :class="{'active': getPage.current_page === page}">
                    <a class="page-link" href="#" 
                       @click.prevent="turnPage(page)"
                    >{{ page }}</a>
                </li>
                <li class="page-item" 
                    :class="{'disabled': !getPage.has_next}"
                >
                    <a class="page-link" href="#" aria-label="Next" 
                       @click.prevent="turnPage(getPage.current_page + 1)">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>
 
<script>
export default {
    props:['getPage'],
    /* 從父元件 :getPage='pagination' 傳來的資料，所以元件裡原為 pegination 都變成 getPage */
    data(){
        return {};
    },
    methods:{
        turnPage(page) {
            this.$emit('postPage', page);
        }
    }
}
</script>