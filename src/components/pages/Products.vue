<template>
    <div>
        <div class="text-right mt-4">
            <button class="btn btn-primary">建立新的產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">分類</th>
                    <th>產品名稱</th>
                    <th width="120">原價</th>
                    <th width="120">售價</th>
                    <th width="100">是否啟用</th>
                    <th width="80">編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item) in products" :key="item.id">
                    <td>{{ item.category }}</td>
                    <td>{{ item.title }}</td>
                    <td class="text-right">{{ item.origin_price }}</td> <!--有金額的部分都靠右-->
                    <td class="text-right">{{ item.price }}</td>
                    <td>
                        <span v-if="item.is_enabled == 1" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm">編輯</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default { // 讓這段程式碼可以匯出給其他元件使用
    data () {
        return {
            products: [],
        };
    },
    methods: {
        getProducts() {
            // console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products`;
            // const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
            // API 伺服器路徑
            // 所申請的 API path
            const vm = this; // 確保在 HTTP 結束之後，可以把取回的資料存在 VM 裡面
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.products = response.data.products;
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