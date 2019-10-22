<template>
    <div>
        <div class="vld-parent">
            <loading :active.sync="isLoading"></loading>
        </div>
        <div class="text-right mt-4">
            <button class="btn btn-primary" data-toggle="modal" @click.prevent="openModal(true)">建立新的產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width="120">分類</th>
                    <th>產品名稱</th>
                    <th width="50">原價</th>
                    <th width="50">售價</th>
                    <th width="100">是否啟用</th>
                    <th width="80">編輯</th>
                    <th width="80">刪除</th>
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
                        <button class="btn btn-outline-primary btn-sm" @click.prevent="openModal(false, item)">編輯</button>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click.prevent="deleteModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination -->
        <PageComponent @postPage="getProducts" :getPagin="pagination"></PageComponent>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>新增產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">
                        <div class="form-group">
                        <label for="image">輸入圖片網址</label>
                        <input type="text" class="form-control" id="image"
                            v-model="tempProduct.imageUrl"
                            placeholder="請輸入圖片連結">
                        </div>
                        <div class="form-group">
                        <label for="customFile">或 上傳圖片
                            <i class="fas fa-spinner fa-spin" v-if="status.fileUploading"></i>
                        </label>
                        <input type="file" id="customFile" class="form-control"
                            ref="files" @change="uploadFile">
                        </div>
                        <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                        class="img-fluid" :src="tempProduct.imageUrl" alt="">
                    </div>
                    <div class="col-sm-8">
                        <div class="form-group">
                        <label for="title">標題</label>
                        <input type="text" class="form-control" id="title"
                            placeholder="請輸入標題" 
                            v-model="tempProduct.title">
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="category">分類</label>
                            <input type="text" class="form-control" id="category"
                            v-model="tempProduct.category"
                            placeholder="請輸入分類">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">單位</label>
                            <input type="unit" class="form-control" id="unit"
                            v-model="tempProduct.unit"
                            placeholder="請輸入單位">
                        </div>
                        </div>

                        <div class="form-row">
                        <div class="form-group col-md-6">
                        <label for="origin_price">原價</label>
                            <input type="number" class="form-control" id="origin_price"
                            v-model="tempProduct.origin_price"
                            placeholder="請輸入原價">
                        </div>
                        <div class="form-group col-md-6">
                            <label for="price">售價</label>
                            <input type="number" class="form-control" id="price"
                            v-model="tempProduct.price"
                            placeholder="請輸入售價">
                        </div>
                        </div>
                        <hr>

                        <div class="form-group">
                        <label for="description">產品描述</label>
                        <textarea type="text" class="form-control" id="description"
                            placeholder="請輸入產品描述"
                            v-model="tempProduct.description"
                            ></textarea>
                        </div>
                        <div class="form-group">
                        <label for="content">說明內容</label>
                        <textarea type="text" class="form-control" id="content"
                            placeholder="請輸入產品說明內容"
                            v-model="tempProduct.content"></textarea>
                        </div>
                        <div class="form-group">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox"
                            v-model="tempProduct.is_enabled"
                            :true-value="1"
                            :false-value="0"
                            id="is_enabled">
                            <label class="form-check-label" for="is_enabled">
                            是否啟用
                            </label>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>刪除產品</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                    <button type="button" class="btn btn-danger" @click="delProduct"
                    >確認刪除</button>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery';

import PageComponent from '../Pagination';

export default { // 讓這段程式碼可以匯出給其他元件使用
    components: {
        PageComponent,
    },
    data () {
        return {
            products: [],
            pagination: {},
            tempProduct: {},
            isNew: false,
            isDelete: '',
            isLoading: false,
            status: {
                fileUploading: false,
            }
        };
    },
    methods: {
        getProducts(page = 1) { // es6 的參數預設值，預設帶入第一頁進來，讓其他程式碼使用，如果後來傳入的數值不為 1 就用後來的數值來替代
            // console.log(process.env.VUE_APP_APIPATH, process.env.VUE_APP_CUSTOMPATH)
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/products?page=${page}`;
            // const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products`;
            // API 伺服器路徑
            // 所申請的 API path
            const vm = this; // 確保在 HTTP 結束之後，可以把取回的資料存在 VM 裡面
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.isLoading = false;
                vm.products = response.data.products;
                vm.pagination = response.data.pagination;
            });
        },
        openModal(isNew, item) {
            if (isNew) {
                this.tempProduct = {};
                this.isNew = true;
            } else {
                this.tempProduct = Object.assign({}, item);
                this.isNew = false;
            }
            $('#productModal').modal('show');
        },
        updateProduct() {
            let api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product`;
            let httpMethod = 'post';
            const vm = this; 
            if (!vm.isNew) {
                api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
                httpMethod = 'put';
            }
            this.$http[httpMethod](api, {data: vm.tempProduct }).then((response) => {
                console.log(response.data)
                if (response.data.success) {
                    $('#productModal').modal('hide');
                    vm.getProducts(); // 更新之後資料再傳回瀏覽器一次，確保後端與前端資料同步
                } else {
                    $('#productModal').modal('hide');
                    vm.getProducts();
                    console.log('新增失敗')
                }
            });
        },
        deleteModal(item) {
            this.tempProduct = item;
            $('#delProductModal').modal('show')
        },
        delProduct() {
            const vm = this;
            const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/product/${vm.tempProduct.id}`;
            this.$http.delete(api).then((response) => {
                vm.products = response.data.products;
                if (response.data.success) {
                    $('#delProductModal').modal('hide');
                    vm.getProducts(); // 更新之後資料再傳回瀏覽器一次，確保後端與前端資料同步
                } else {
                    $('#delProductModal').modal('hide');
                    vm.getProducts();
                    console.log('無法找到這項產品')
                }
            });
        },
        uploadFile() {
            console.log(this);
            const uploadedFile = this.$refs.files.files[0];
            const vm = this;
            const formData = new FormData(); // 模擬傳統表單送出的形式 
            formData.append('file-to-upload', uploadedFile); // 用 append 的方式將欄位新增進去
            const url = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/admin/upload`;
            vm.status.fileUploading = true;
            this.$http.post(url, formData, {
                headers:{
                    'Content-Type':'multipart/form-data'
                },
            }).then(
                function(response) { // 練習把箭頭函式還原
                    vm.status.fileUploading = false;
                    if (response.data.success) {
                        vm.$set(vm.tempProduct, 'imageUrl', response.data.imageUrl);
                        return response;
                    } else {
                        vm.$bus.$emit('message:push', response.data.message, 'danger')
                    }   
                }
            );
        },
    },
    created() {
        this.getProducts();
    }
}
</script>

<style>

</style>