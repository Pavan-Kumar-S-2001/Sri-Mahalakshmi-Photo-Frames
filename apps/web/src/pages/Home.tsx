export default function Home() {
  return (
    <div style={{textAlign: "center", marginTop: "100px"}}>
      <h1>Website Temporarily Unavailable</h1>
      <p>This website has been suspended due to pending payment.</p>
    </div>
  );
}
// import HeroSlider from '../components/HeroSlider'
// import { Link } from 'react-router-dom'
// import { Helmet } from 'react-helmet-async'

// export function HomePage() {
//   return (
//     <div className="mx-auto max-w-7xl">
//       <Helmet>
//         <title>Sri Mahalakshmi Photo Frames - Custom Photo Frames</title>
//         <meta
//           name="description"
//           content="Premium custom photo frames and photo design services. Upload your photo, customize your frame, and get it delivered."
//         />
//       </Helmet>

//       <section className="relative w-full overflow-hidden">
//         <HeroSlider />
//       </section>

//       <section className="container-px py-16">
//         <h2 className="text-center text-2xl font-bold text-zinc-950">
//           Why Choose Us
//         </h2>

//         <div className="mt-10 grid gap-6 md:grid-cols-3">
//           {[
//             {
//               title: 'Premium Quality',
//               desc: 'High-end materials and finishing',
//             },
//             {
//               title: 'Custom Designs',
//               desc: 'Personalized frames for your memories',
//             },
//             {
//               title: 'Fast Delivery',
//               desc: 'Quick and safe doorstep delivery',
//             },
//           ].map((item) => (
//             <div
//               key={item.title}
//               className="rounded-3xl border border-zinc-200 p-6 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
//             >
//               <h3 className="text-lg font-semibold text-zinc-950">
//                 {item.title}
//               </h3>
//               <p className="mt-2 text-sm text-zinc-600">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="border-y border-zinc-200 bg-zinc-50">
//         <div className="container-px py-16">
//           <div className="flex items-end justify-between gap-4">
//             <div>
//               <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
//                 Featured frames
//               </h2>
//               <p className="mt-1 text-sm text-zinc-600">
//                 Best sellers curated for modern homes.
//               </p>
//             </div>
//             <Link className="text-sm font-semibold text-zinc-950" to="/shop">
//               Shop all
//             </Link>
//           </div>

//           <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
//               >
//                 <div className="aspect-[4/3] w-full rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200" />
//                 <div className="mt-4 flex items-center justify-between gap-3">
//                   <div>
//                     <div className="text-sm font-semibold text-zinc-950">
//                       Signature Frame {i}
//                     </div>
//                     <div className="mt-1 text-sm text-zinc-600">
//                       From Rs. 999
//                     </div>
//                   </div>
//                   <Link
//                     to="/shop"
//                     className="rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 px-3 py-2 text-xs font-semibold text-white"
//                   >
//                     Customize
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <section className="container-px py-16">
//         <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
//           Customer reviews
//         </h2>
//         <div className="mt-6 grid gap-4 md:grid-cols-3">
//           {[
//             'Beautiful finish and fast delivery.',
//             'The preview matched the final frame perfectly.',
//             'Premium look - worth it.',
//           ].map((text) => (
//             <div
//               key={text}
//               className="rounded-2xl border border-zinc-200 bg-white p-5"
//             >
//               <div className="text-sm text-zinc-600">{text}</div>
//               <div className="mt-3 text-xs font-semibold text-zinc-950">
//                 Verified customer
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   )
// }