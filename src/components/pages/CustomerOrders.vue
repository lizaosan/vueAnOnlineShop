<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                     :style="{backgroundImage: `url(${item.image}`}">
                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{ item.title }}</a>
                    </h5>
                    <p class="card-text">{{ item.content }}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="item.origin_price == item.price"></div> 
                        <del class="h6" v-if="item.origin_price !== item.price">原價{{ item.origin_price }}元</del>
                        <div class="h5" >{{ item.price }}元</div> 
                    </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm"
                        @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto"
                        @click="addtoCart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.loadingItem === item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
              aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="product.image" class="img-fluid" alt="">
                        <blockquote class="blockquote mt-3">
                        <p class="mb-0">{{ product.content }}</p>
                        <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h4" v-if="product.origin_price == product.price"></div>
                        <del class="h6" v-if="product.origin_price !== product.price">原價 {{ product.origin_price }} 元</del>
                        <div class="h4" v-if="product.price"> {{ product.price }} 元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                        <option :value="num" v-for="num in 10" :key="num">
                            選購 {{num}} {{product.unit}}
                        </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                        小計 <strong>{{ product.num * product.price }}</strong> 元
                        </div>
                        <button type="button" class="btn btn-primary"
                        @click="addtoCart(product.id, product.num)">
                        <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                        加到購物車
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <table class="table">
                    <thead>
                        <tr>
                            <th>品名</th>
                            <th class="text-right" width="60">數量</th>
                            <th class="text-right" width="80">單價</th>
                            <th class="text-center" width="60">刪除</th>                    
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item) in carts.carts" :key="item.id">
                            <td>{{ item.product.title }}</td>
                            <td class="text-right">{{ item.qty }}{{ item.product.unit }}</td>
                            <td class="text-right">{{ item.product.price * item.qty | currency }}</td>
                            <td class="text-center"><a href="#" class="text-danger" @click.prevent="removeCartItem(item.id)"><i class="fas fa-trash-alt"></i></a></td>
                        </tr>
                        <tr>
                            <td colspan="3"><div class="text-right">總計</div></td>
                            <td class="text-center">{{ carts.total | currency }}</td>
                        </tr>
                        <tr v-if="carts.final_total !== carts.total">
                            <td colspan="3"><div class="text-primary text-right">折扣價</div></td>
                            <td class="text-center"><b class="text-primary">{{ carts.final_total | currency }}</b></td>
                        </tr>
                    </tbody>
                </table>
                <div class="input-group mb-3 input-group-sm">
                    <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
                    <div class="input-group-append">
                    <button type="submit" class="btn btn-outline-primary" @click.prevent="addCouponCode()">提交優惠碼</button>
                    </div>
                </div>
            </div> 
            <div class="col-md-3"></div> 
        </div>   
    </div>
</template>

<script>
import $ from 'jquery';

export default { // 讓這段程式碼可以匯出給其他元件使用
    data () {
        return {
            products: [],
            carts: [],
            product: {},
            status: {
                loadingItem: '',
            },
            isLoading: false,
            coupon_code: '',
        };
    },
    methods: {
        getProducts(page = 1) { 
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products?page=${page}`;
            const vm = this; 
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.isLoading = false;
                vm.products = response.data.products;
                vm.pagination = response.data.pagination;
            });
        },
        getProduct(id) {
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`;
            const vm = this; 
            vm.status.loadingItem = id;
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.product = response.data.product;
                $('#productModal').modal('show');
                vm.status.loadingItem = '';
            });
        },
        addtoCart(id, qty = 1) {
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
            const vm = this; 
            vm.status.loadingItem = id;
            const cart = {
                product_id: id,
                qty,
            }
            this.$http.post(api, {data: cart }).then((response) => {
                console.log(response.data)
                vm.status.loadingItem = '';
                vm.getCart();
                $('#productModal').modal('hide');
            });
        },
        getCart() {
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`;
            const vm = this; 
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
                console.log(response.data)
                vm.isLoading = false;
                vm.carts = response.data.data;
            });            
        },
        removeCartItem(id) {
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${id}`;
            const vm = this; 
            vm.isLoading = true;
            this.$http.delete(api).then((response) => {
                console.log(response.data)
                vm.getCart();
                vm.isLoading = false;
            });   
        },
        addCouponCode() {
            const api =`${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`;
            const vm = this; 
            const coupon = {
                code: vm.voupon_code
            }
            vm.isLoading = true;
            this.$http.post(api, {data: coupon}).then((response) => {
                console.log(response.data)
                vm.getCart();
                vm.isLoading = false;
            });   
        }
    },
    created() {
        this.getProducts();
        this.getCart();
    }
}

</script>