<template>
  <!-- component -->
  <div class="bg-gray-100 flex flex-col lg:flex-row justify-center items-center h-screen">
    <div class="w-1/2 h-screen hidden lg:block">
      <img
        src="/images/login.jpg"
        alt="Placeholder Image"
        class="object-cover w-full h-full"
      >
    </div>
    <!-- Right: Login Form -->
    <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <RouterView />
    </div>
  </div>
</template>
