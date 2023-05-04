<template>
  <section id="feature">
    <div class="container px-4 py-5" id="featured-3">
      <h2 class="pb-2 border-bottom">Das bietet Schillerando</h2>
    </div>
    <div class="row g-4 py-5 row-cols-1 row-cols-lg-3">
      <FeatureTile
        :left="true"
        :forCompanies="false"
        image="products.png"
        title="Produkte"
        text="Entdecke alle Produkte und Angebote im Staat. Egal ob Essen, Trinken, Aktivitäten oder Sonstiges."
        link="/produkte"
        linkTitle="Produkte"
      ></FeatureTile>
      <FeatureTile
        :left="false"
        :forCompanies="false"
        image="location.png"
        title="Unternehmen"
        text="Erhalte einen Überblick über alle Unternehmen im Staat und finde leichter zu ihnen."
        link="/unternehmen"
        linkTitle="Unternehmen"
      ></FeatureTile>
      <FeatureTile
        :left="true"
        :forCompanies="false"
        image="prices.png"
        title="Preisvergleich"
        text="Vergleiche Preise um immer das günstigste Produkt zu finden und Geld zu sparen."
        link="/produkte"
        linkTitle="Preisvergleich"
      ></FeatureTile>
      <FeatureTile
        :left="false"
        :forCompanies="false"
        title="Lieferung"
        image="delivery.png"
        text="Lasse Produkte wie Essen oder Trinken schnell und kostenlos zu dir liefern."
        link="/auth"
        linkTitle="Registrieren"
      ></FeatureTile>
      <FeatureTile
        :left="true"
        :forCompanies="true"
        image="boosting.png"
        title="Werbung"
        text="Mache dein Unternehmen bekannt und erreiche mehr Kunden."
        link="https://business.schillerando.de/companyRegistration"
        linkTitle="Business"
      ></FeatureTile>
      <FeatureTile
        :left="false"
        :forCompanies="true"
        image="accounting.png"
        title="Buchhaltung"
        text="Habe immer alle Einnahmen und Ausgaben deines Unternehmens im Blick."
        link="https://business.schillerando.de"
        linkTitle="Buchhaltung"
      ></FeatureTile>
      <FeatureTile
        :left="true"
        :forCompanies="true"
        image="service.png"
        title="Services"
        text="Lasse dir vor und während Schule als Staat Ware für dein Unternehmen aus dem Ausland liefern, deinen Müll entsorgen und weiteres."
        link="https://business.schillerando.de/service"
        linkTitle="Services"
      ></FeatureTile>
    </div>
  </section>
</template>

<script>
import FeatureTile from './FeatureTile.vue';

export default {
  name: 'FeatureSection',
  components: {
    FeatureTile,
  },
};
</script>

<style scoped>
section {
  padding: 3% 2% 3% 2%;
}
</style>
