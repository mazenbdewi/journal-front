<template>
  <footer id="footer" class="footer position-relative light-background">
    <div class="container copyright text-center mt-4">
      <p>
        © <span>{{ $t("footer.copyright") }}</span>
        <strong class="px-1 sitename">{{
          $t("footer.university_name")
        }}</strong>
        <span>{{ $t("footer.all_rights_reserved") }}</span>
      </p>
      <div class="credits">
        {{ $t("footer.affiliated") }}
        <a
          href="https://latakia-univ.edu.sy"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t("footer.university_link") }}
        </a>
        <br />
        {{ $t("footer.designed_by") }}
        <a
          href="https://mazenbdewi.com/"
          target="_blank"
          rel="noopener noreferrer"
          >Mazen Bdewi</a
        >
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>
