
const searchResult = document.getElementById("searchResult");

let timeout = null;

function createElements(json) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("wrapper");
  searchResult.innerHTML = "";
  json.map((data) => {
    const wF = document.createElement("div");
    wF.classList.add("min-h-44", "w-full");
    const rel = document.createElement("div");
    rel.classList.add("relative", "h-6");
    wF.appendChild(rel);
    const line = document.createElement("div");
    line.classList.add("line", "lline");
    const title = document.createElement("div");
    title.classList.add("title", "ttitle");
    if (data.albumtitle) {
      title.innerText = data.albumtitle;
    }
    const timeA = document.createElement("div");
    timeA.classList.add("timealbum", "");
    if (data.time) {
      timeA.innerText = data.time;
    }
    rel.appendChild(line);
    rel.appendChild(title);
    rel.appendChild(timeA);
    const img = document.createElement("img");
    img.classList.add("absolute", "top-12");
    if (data.src) {
      img.src = data.src;
    }

    rel.appendChild(img);
    const cont = document.createElement("div");
    cont.classList.add("absolute", "top-12");

    data.songs?.map((e) => {
      const link = document.createElement("a");
      link.classList.add("block", "p-1.5");

      const b = document.createElement("div");
      b.classList.add("flex", "justify-between");

      const s1 = document.createElement("span");
      if (e.text) {
        s1.innerText = e.text;
      }
      const s2 = document.createElement("span");

      if (e.time) {
        s2.innerText = e.time;
      }
      b.appendChild(s1);
      b.appendChild(s2);
      link.appendChild(b);
      cont.appendChild(link);
    });
    wrapper.appendChild(wF);
    // <div class="min-h-44 w-full">
    //   <div class="relative h-6">
    //     <div class="line absolute left-0 right-0 top-4 h-0.5" />
    //     <div class="title absolute left-0 top-0 z-50 w-max bg-black pr-14">
    //       {data.albumtitle}
    //     </div>
    //     <div class="absolute -right-16 top-1 z-50 bg-black pl-8">
    //       {data.time}
    //     </div>
    //     {data.src && (
    //       <img
    //         src={"https://9tails.fans/" + data.src}
    //         class="absolute top-12"
    //       />
    //     )}
    //   </div>
    //   <div class="ml-44 mt-8 flex flex-col">
    //     {data.songs?.map((e) => {
    //       return (
    //         <a
    //           class="block p-1.5"
    //           href={"https://9tails.fans/" + e.onclick}
    //         >
    //           <div class="flex justify-between">
    //             <span>{e.text}</span>
    //             <span>{e.time}</span>
    //           </div>
    //         </a>
    //       );
    //     })}
    //   </div>
    // </div>
  });
	searchResult?.appendChild(wrapper)
}

const searchInput = document.getElementById("searchInput");
searchInput?.addEventListener("input", (e) => {
	console.log("fdsafdsafdsafsda")
  if (timeout != null) clearTimeout(timeout);
  timeout = setTimeout(() => {
createElements({})

	}, 500);
});

<script define:vars={{ json ,her}}>
  const searchResult = document.getElementById("searchResults");

  let timeout = null;

  function createElements(json) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    searchResult.innerHTML = "";
    json.map((data) => {
      const wF = document.createElement("div");
      wF.classList.add("min-h-44", "w-full");
      const rel = document.createElement("div");
      rel.classList.add("relative", "h-6");
      wF.appendChild(rel);
      const line = document.createElement("div");
      line.classList.add("line", "lline");
      const title = document.createElement("div");
      title.classList.add("title", "ttitle");
      if (data.albumtitle) {
        title.innerText = data.albumtitle;
      }
      const timeA = document.createElement("div");
      timeA.classList.add("timealbum");
      if (data.time) {
        timeA.innerText = data.time;
      }
      rel.appendChild(line);
      rel.appendChild(title);
      rel.appendChild(timeA);
      const img = document.createElement("img");
      img.classList.add("absolute", "top-12");
      if (data.src) {
        img.src = her + data.src;
      }

      rel.appendChild(img);
      const cont = document.createElement("div");
      cont.classList.add("cont");

      data.songs?.map((e) => {
        const link = document.createElement("a");
        link.classList.add("block", "p-1.5");
        link.href = her + e.onclick;

        const b = document.createElement("div");
        b.classList.add("flex", "justify-between");

        const s1 = document.createElement("span");
        if (e.text) {
          s1.innerText = e.text;
        }
        const s2 = document.createElement("span");

        if (e.time) {
          s2.innerText = e.time;
        }
        b.appendChild(s1);
        b.appendChild(s2);
        link.appendChild(b);
        cont.appendChild(link);
      });
		  wF.appendChild(cont)
      wrapper.appendChild(wF);
      // <div class="min-h-44 w-full">
      //   <div class="relative h-6">
      //     <div class="line absolute left-0 right-0 top-4 h-0.5" />
      //     <div class="title absolute left-0 top-0 z-50 w-max bg-black pr-14">
      //       {data.albumtitle}
      //     </div>
      //     <div class="absolute -right-16 top-1 z-50 bg-black pl-8">
      //       {data.time}
      //     </div>
      //     {data.src && (
      //       <img
      //         src={"https://9tails.fans/" + data.src}
      //         class="absolute top-12"
      //       />
      //     )}
      //   </div>
      //   <div class="ml-44 mt-8 flex flex-col">
      //     {data.songs?.map((e) => {
      //       return (
      //         <a
      //           class="block p-1.5"
      //           href={"https://9tails.fans/" + e.onclick}
      //         >
      //           <div class="flex justify-between">
      //             <span>{e.text}</span>
      //             <span>{e.time}</span>
      //           </div>
      //         </a>
      //       );
      //     })}
      //   </div>
      // </div>
    });
    searchResult?.appendChild(wrapper);
  }

  const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("input", (e) => {
    console.log("fdsafdsafdsafsda");
    if (timeout != null) clearTimeout(timeout);
    timeout = setTimeout(() => {
      createElements(json);
    }, 500);
  });
</script>
