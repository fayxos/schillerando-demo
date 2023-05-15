<template>
  <div>
    <div v-if="this.company === null">
      Ups, dieses Unternehmen scheint nicht zu existieren
    </div>
    <div v-else>
      <div class="image">
        <div v-if="this.company.image == null" class="no-image">
          <i class="fa-solid fa-image fa-2xl"></i>
        </div>
        <img
          v-else
          :src="this.company.image"
          alt="Unternehmen Bild"
          id="companyImage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';

export default {
  name: 'CompanyDetailView',
  props: ['companyuuid'],
  data() {
    return {
      company: undefined,
    };
  },
  async mounted() {
    if (this.$route.params.companyalias) {
      const { data, error } = await supabase
        .from('companies')
        .select()
        .eq('alias', this.$route.params.companyalias);
      if (error != null) console.log(error);
      if (data === null || data.length === 0) {
        this.company = null;
        return;
      }
      this.company = data[0];

      if (this.company.header_picture != null) {
        const response = await supabase.storage
          .from('public/sellers-headings')
          .download(this.company.header_picture);
        if (response.data != null)
          this.company.image = await response.data.text();
        if (response.error) console.warn(response.error);
      }
    }
  },
};
</script>

<style scoped>
.image {
  width: 100%;
  position: relative;
  padding-bottom: 56.25%;
  margin-bottom: 10px;
}

.no-image {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 0.375rem;
}

img {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
  left: 0;
}

.fa-image {
  position: absolute;
  font-size: 6rem;
  top: 50%;
  left: calc(50% - 3rem);
}
</style>
