<template>
  <div id="home">
    <Hero :items="items" />
    <Banner1 />
    <Container>
      <TileRow :tiles="tiles1" />
    </Container>
    <Container>
      <Heading title="5 Gründe für unseren Kakao" />
    </Container>
    <Container>
      <Carousel :items="carouselItems1" />
    </Container>
    <Container>
      <TileRow :tiles="tiles2" />
    </Container>
    <Container>
      <Heading subtitle="du bekommst unseren koffein kakao bei folgenden partnern" />
    </Container>
    <Container>
      <Carousel :items="carouselItems2" :settings="carouselSettings2" />
    </Container>
    <BackgroundBanner background-image="/assets/img/products/wellenlinie.svg" straight-bottom>
      <Container>
        <Heading
          title="die kakaorevolution auf instagram"
          subtitle="poste #… mit etwas glück featuren wir dich auf unserer seite!"
        />
        <Carousel :items="carouselItems3" :settings="carouselSettings3" />
      </Container>
    </BackgroundBanner>
    <BackgroundBanner background-image="/assets/img/green-bg.png" straight>
      <Container>
        <img src="/assets/img/newsletter_form.png" >
      </Container>
    </BackgroundBanner>

    <promoted-offers/>

    <section class="new-collection container px15">
      <div>
        <header class="col-md-12">
          <h2 class="align-center cl-accent">{{ $t('Everything new') }}</h2>
        </header>
      </div>
      <div class="row center-xs">
        <product-listing columns="4" :products="everythingNewCollection" />
      </div>
    </section>

    <section class="container pb60 px15">
      <div class="row center-xs">
        <header class="col-md-12 pt40">
          <h2 class="align-center cl-accent">{{ $t('Get inspired') }}</h2>
        </header>
      </div>
      <tile-links />
    </section>
    <Onboard/>
  </div>
</template>

<script>
// hui compoments
import Hero from 'hui/src/components/molecules/Hero'
import Banner1 from 'hui/src/components/molecules/Banner1.vue'
import Container from 'hui/src/components/atoms/Container.vue'
import TileRow from 'hui/src/components/molecules/TileRow.vue'
import Heading from 'hui/src/components/atoms/Heading.vue'
import Carousel from 'hui/src/components/organisms/Carousel.vue'
import BackgroundBanner from 'hui/src/components/atoms/BackgroundBanner.vue'
import Columns from 'hui/src/components/molecules/Columns.vue'
import Column from 'hui/src/components/molecules/Column.vue'

// query constructor
import { prepareQuery } from '@vue-storefront/core/modules/catalog/queries/common'
import { isServer } from '@vue-storefront/core/helpers'

// Core pages
import Home from '@vue-storefront/core/pages/Home'

// Theme core components
import ProductListing from 'theme/components/core/ProductListing'
import HeadImage from 'theme/components/core/blocks/MainSlider/HeadImage'

// Theme local components
import Onboard from 'theme/components/theme/blocks/Home/Onboard'
import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers'
import TileLinks from 'theme/components/theme/blocks/TileLinks/TileLinks'
import { Logger } from '@vue-storefront/core/lib/logger'
export default {
  mixins: [Home],
  components: {
    HeadImage,
    Onboard,
    ProductListing,
    PromotedOffers,
    TileLinks,
    Hero,
    Banner1,
    TileRow,
    Heading,
    Carousel,
    BackgroundBanner,
    Columns,
    Column,
    Container
  },
  computed: {
    categories () {
      return this.getCategories
    },
    everythingNewCollection () {
      return this.$store.state.homepage.new_collection
    },
    coolBagsCollection () {
      return this.$store.state.homepage.coolbags_collection
    }
  },
  created () {
    // Load personal and shipping details for Checkout page from IndexedDB
    this.$store.dispatch('checkout/load')
  },
  async beforeMount () {
    if (this.$store.state.__DEMO_MODE__) {
      const onboardingClaim = await this.$store.dispatch('claims/check', { claimCode: 'onboardingAccepted' })
      if (!onboardingClaim) { // show onboarding info
        this.$bus.$emit('modal-toggle', 'modal-onboard')
        this.$store.dispatch('claims/set', { claimCode: 'onboardingAccepted', value: true })
      }
    }
  },
  async asyncData ({ store, route }) { // this is for SSR purposes to prefetch data
    const config = store.state.config

    Logger.info('Calling asyncData in Home (theme)')()

    let newProductsQuery = prepareQuery({ queryConfig: 'newProducts' })
    let coolBagsQuery = prepareQuery({ queryConfig: 'coolBags' })

    const newProductsResult = await store.dispatch('product/list', {
      query: newProductsQuery,
      size: 8,
      sort: 'created_at:desc'
    })
    if (newProductsResult) {
      store.state.homepage.new_collection = newProductsResult.items
    }

    const coolBagsResult = await store.dispatch('product/list', {
      query: coolBagsQuery,
      size: 4,
      sort: 'created_at:desc',
      includeFields: config.entities.optimize ? (config.products.setFirstVarianAsDefaultInURL ? config.entities.productListWithChildren.includeFields : config.entities.productList.includeFields) : []
    })
    if (coolBagsResult) {
      store.state.homepage.coolbags_collection = coolBagsResult.items
    }

    await store.dispatch('promoted/updateHeadImage')
    await store.dispatch('promoted/updatePromotedOffers')
  },
  beforeRouteEnter (to, from, next) {
    if (!isServer && !from.name) { // Loading products to cache on SSR render
      next(vm => {
        let newProductsQuery = prepareQuery({ queryConfig: 'newProducts' })
        vm.$store.dispatch('product/list', {
          query: newProductsQuery,
          size: 8,
          sort: 'created_at:desc'
        })
      })
    } else {
      next()
    }
  },
  data () {
    return {
      items: [
        {
          title: 'Die Welt braucht dich wach',
          text: 'Mache mit einer Tasse koawach die Welt Schluck für Schluck fairer. Dank bester fair gehandelter Zutaten bleibt mehr bei den',
          buttonText: 'Kauf dich wach',
          background: '#eceff1',
          image: '/assets/img/cacao-bg.jpg'
        },
        {
          title: 'Anderer Titel',
          buttonText: 'Klick mal hier',
          text: 'Ganz anderer Text. Ganz anderer Text. Ganz anderer Text. Ganz anderer Text. Ganz anderer Text. Ganz anderer Text. ',
          image: '/assets/img/cacao-bg.jpg'
        },
        {
          title: 'Die Welt braucht dich wach',
          buttonText: 'Kauf dich wach',
          text: 'Mache mit einer Tasse koawach die Welt Schluck für Schluck fairer. Dank bester fair gehandelter Zutaten bleibt mehr bei den Bauern in Lateinamerika und mehr Genuss bei dir.',
          background: '#fce4ec',
          image: '/assets/img/cacao-bg.jpg'
        }
      ],
      tiles1: [
        {
          heading: 'kakao kaufen',
          cta: 'jetzt entdecken',
          image: '/assets/img/cacao-bg.jpg'
        },
        {
          heading: 'abo',
          cta: 'jetzt entdecken',
          image: ''
        }
      ],
      tiles2: [
        {
          heading: 'angebot',
          cta: 'jetzt für 2,99€ shoppen'
        },
        {
          heading: 'abo',
          cta: 'jetzt entdecken',
          image: ''
        }
      ],
      carouselItems1: [
        { image: '/assets/img/carousel1.png' },
        { image: '/assets/img/carousel2.png' },
        { image: '/assets/img/carousel3.png' },
        { image: '/assets/img/carousel1.png' },
        { image: '/assets/img/carousel2.png' }
      ],
      carouselItems2: [
        { image: '/assets/img/reseller/1.png' },
        { image: '/assets/img/reseller/2.png' },
        { image: '/assets/img/reseller/3.png' },
        { image: '/assets/img/reseller/4.png' },
        { image: '/assets/img/reseller/5.png' },
        { image: '/assets/img/reseller/6.png' },
        { image: '/assets/img/reseller/1.png' },
        { image: '/assets/img/reseller/2.png' },
        { image: '/assets/img/reseller/3.png' },
        { image: '/assets/img/reseller/4.png' }
      ],
      carouselItems3: [
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' },
        { image: '/assets/img/placeholder_gray.png' }
      ],
      carouselSettings2: {
        perView: 6
      },
      carouselSettings3: {
        perView: 4
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .new-collection {
    @media (max-width: 767px) {
      padding-top: 0;
    }
  }
</style>
