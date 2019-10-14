<template>
    <div>
        Products Page
    </div>
</template>

<script>
export default { // 讓這段程式碼可以匯出給其他元件使用
    data () {
        return {
            products: [

            ],
        };
    },
    methods: {
        getProducts() {
            // console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
            // API 伺服器路徑
            // 所申請的 API path
            const vm = this; // 確保在 HTTP 結束之後，可以把取回的資料存在 VM 裡面
            this.$http.get(api).then((response) => {
                console.log(response.data)
            });
        },
    },
    created() {
        this.getProducts();
    }
}
</script>

<style>

</style>