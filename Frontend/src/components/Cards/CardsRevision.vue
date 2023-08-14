<template>
<b-card class="progress-banner" no-body>
    <b-card-body class="justify-content-between d-flex flex-row align-items-center">
        <div>
            <i :class="`${icon} mr-1 text-white align-text-bottom d-inline-block`" />
            <div>
                <p class="lead text-white">{{ title }}</p>
                <p class="text-small text-white">{{ detail }}</p>
            </div>
        </div>
        <div class="progress-bar-circle progress-bar-banner position-relative">
            <radial-progress-bar :diameter="diameter" :strokeWidth="strokeWidth" :completed-steps="avance" :total-steps=100>{{progressText}}</radial-progress-bar>
        </div>
    </b-card-body>
</b-card>
</template>

<script>
import RadialProgressBar from 'vue-radial-progress'
export default {
    name: 'Parent',
    components: {
        'radial-progress-bar': RadialProgressBar
    },
    props: {
        icon:null,
        title:"",
        detail:"",
        progressText:"",
        callback: {
        type: Function
      }
    },
    data() {
        return {
            diameterDefault: 140,
            strokeWidthDefault: 5,
            diameter: this.diameterDefault,
            strokeWidth: this.strokeWidthDefault,
            avance:0,
        }
    },
    mounted() {
        window.addEventListener('resize', this.handleWindowResize)
        this.handleWindowResize()
        this.execute()
    },
    methods: {
        handleWindowResize(event) {
            if (event && !event.isTrusted) {
                return
            }
            const windowWidth = window.innerWidth
            if (windowWidth <= 1200) {
                this.diameter = 110
                this.strokeWidth = 5
            } else {
                this.diameter = this.diameterDefault
                this.strokeWidth = this.strokeWidthDefault
            
            }
        },

            execute() {
                if (this.callback) {
                this.avance=this.callback(5,4)
                }
             }

    }
}
</script>
