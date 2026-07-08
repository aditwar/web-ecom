// 'use client';

// import React, { Fragment, useEffect, useRef, useState } from 'react';
// import { gsap } from 'gsap';
// import { Field, Select } from '@headlessui/react';
// import { ChevronDownIcon } from '@heroicons/react/20/solid';
// import { useGSAP } from '@gsap/react';
// import { ArrowPathIcon } from '@heroicons/react/24/outline';
// import clsx from 'clsx';
// import Splitting from 'splitting';

// type EffectType = (typeof effectTypes)[number];

// interface SelectEffectProps {
//   setEffect: React.Dispatch<React.SetStateAction<EffectType>>;
// }

// interface TextEffectProps {
//   effect: EffectType;
//   text: string;
//   setEffect: React.Dispatch<React.SetStateAction<EffectType>>;
// }

// const wrapElements = (
//   elems: NodeListOf<Element> | Element[],
//   wrapType: keyof HTMLElementTagNameMap,
//   wrapClass: string,
// ): void => {
//   Array.from(elems).forEach((elem) => {
//     const wrapEl = document.createElement(wrapType);
//     wrapEl.className = wrapClass;
//     elem.parentNode?.insertBefore(wrapEl, elem);
//     wrapEl.appendChild(elem);
//   });
// };

// function transformString(input: EffectType) {
//   return (
//     input
//       // Replace hyphens with spaces
//       .replace(/-/g, ' ')
//       // Capitalize the first letter of each word
//       .replace(/\b\w/g, (char) => char.toUpperCase())
//       // Add space before numbers
//       .replace(/(\d+)/g, ' $1')
//       .trim()
//   ); // Remove any leading or trailing spaces
// }

// const effectTypes = [
//   'char-variation-1',
//   'char-variation-2',
//   'char-variation-3',
//   'char-variation-4',
//   'char-variation-5',
//   'char-variation-6',
//   'word-variation-1',
//   'word-variation-2',
//   'word-variation-3',
// ] as const;

// const TextEffect: React.FC<TextEffectProps> = ({ effect, text, setEffect }) => {
//   const scope = useRef<HTMLDivElement>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const timelineRef = useRef<gsap.core.Timeline | null>(null);
//   const [splitting, setSplitting] = useState<any>(null);

//   useEffect(() => {
//     // @ts-expect-error no modules for typescript
//     import('splitting').then((Splitting) => {
//       setSplitting(() => Splitting.default);
//     });
//   }, []);

//   useEffect(() => {
//     if (splitting) {
//       splitting();
//     }
//   }, [splitting]);

//   useGSAP(
//     async () => {
//       if (!splitting && !scope.current) return;
//       await splitting({ target: scope.current });

//       const chars = scope.current?.querySelectorAll('.char');
//       const words = scope.current?.querySelectorAll('.word');

//       if (!chars || !words || !chars?.length || !words?.length) return;

//       timelineRef.current = gsap
//         .timeline({ paused: true })
//         .eventCallback('onComplete', () => setIsPlaying(false));

//       switch (effect) {
//         case 'char-variation-1':
//           timelineRef.current.fromTo(
//             chars,
//             {
//               skewX: -30,
//               filter: 'blur(10px) brightness(0%)',
//               willChange: 'filter, transform',
//             },
//             {
//               skewX: 0,
//               filter: 'blur(0px) brightness(100%)',
//               duration: 0.5,
//               stagger: 0.05,
//               ease: 'none',
//             },
//           );
//           break;
//         case 'char-variation-2':
//           timelineRef.current.fromTo(
//             chars,
//             {
//               scaleY: 0.1,
//               scaleX: 1.8,
//               filter: 'blur(10px) brightness(50%)',
//               willChange: 'filter, transform',
//             },
//             {
//               scaleY: 1,
//               scaleX: 1,
//               filter: 'blur(0px) brightness(100%)',
//               duration: 0.5,
//               stagger: 0.05,
//               ease: 'none',
//             },
//           );
//           break;
//         case 'char-variation-3':
//           timelineRef.current.fromTo(
//             chars,
//             {
//               willChange: 'opacity, transform',
//               opacity: 0,
//               xPercent: () => gsap.utils.random(-200, 200),
//               yPercent: () => gsap.utils.random(-150, 150),
//             },
//             {
//               ease: 'power1.inOut',
//               opacity: 1,
//               xPercent: 0,
//               yPercent: 0,
//               stagger: { each: 0.05, grid: 'auto', from: 'random' },
//             },
//           );
//           break;
//         case 'char-variation-4':
//           wrapElements(chars, 'span', 'char-wrap');
//           timelineRef.current.fromTo(
//             chars,
//             {
//               willChange: 'transform',
//               xPercent: -250,
//               rotationZ: 45,
//               scaleX: 6,
//               transformOrigin: '100% 50%',
//             },
//             {
//               duration: 1,
//               ease: 'power2',
//               xPercent: 0,
//               rotationZ: 0,
//               scaleX: 1,
//               stagger: 0.06,
//             },
//           );
//           break;
//         case 'char-variation-5':
//           wrapElements(chars, 'span', 'char-wrap');
//           timelineRef.current.fromTo(
//             chars,
//             {
//               willChange: 'transform',
//               transformOrigin: '0% 50%',
//               xPercent: 105,
//             },
//             {
//               duration: 1,
//               ease: 'expo',
//               xPercent: 0,
//               stagger: 0.05,
//             },
//           );
//           break;
//         case 'char-variation-6':
//           timelineRef.current.fromTo(
//             chars,
//             {
//               willChange: 'transform',
//               transformOrigin: '50% 100%',
//               scaleY: 0,
//             },
//             {
//               ease: 'power3.in',
//               opacity: 1,
//               scaleY: 1,
//               stagger: 0.05,
//             },
//           );
//           break;
//         case 'word-variation-1':
//           timelineRef.current.fromTo(
//             words,
//             {
//               willChange: 'opacity',
//               opacity: 0,
//               filter: 'blur(20px)',
//             },
//             {
//               duration: 1,
//               ease: 'power1.inOut',
//               opacity: 1,
//               filter: 'blur(0px)',
//               stagger: { each: 0.05, from: 'random' },
//             },
//           );
//           break;
//         case 'word-variation-2':
//           timelineRef.current.fromTo(
//             words,
//             {
//               willChange: 'transform',
//               transformOrigin: '50% 0%',
//               scaleY: 0,
//               overflow: 'hidden',
//             },
//             {
//               ease: 'back.inOut',
//               opacity: 1,
//               scaleY: 1,
//               yPercent: 0,
//               stagger: 0.1,
//               duration: 1,
//             },
//           );
//           break;
//         case 'word-variation-3':
//           words.forEach((word) =>
//             gsap.set(word.parentNode, { perspective: 1000 }),
//           );
//           timelineRef.current.fromTo(
//             words,
//             {
//               willChange: 'opacity, transform',
//               z: () => gsap.utils.random(500, 950),
//               opacity: 0,
//               xPercent: () => gsap.utils.random(-100, 100),
//               yPercent: () => gsap.utils.random(-10, 10),
//               rotationX: () => gsap.utils.random(-90, 90),
//             },
//             {
//               ease: 'expo',
//               opacity: 1,
//               rotationX: 0,
//               rotationY: 0,
//               xPercent: 0,
//               yPercent: 0,
//               duration: 2,
//               stagger: { each: 0.1, from: 'random' },
//               z: 0,
//             },
//           );
//           break;
//         default:
//           break;
//       }

//       // Play the animation immediately when the effect changes
//       timelineRef.current.restart();
//       setIsPlaying(true);
//     },
//     { scope, dependencies: [effect, splitting] },
//   );

//   const handlePlay = () => {
//     if (isPlaying || !timelineRef.current) return;
//     setIsPlaying(true);
//     timelineRef.current.restart();
//   };

//   return (
//     <Fragment>
//       <div
//         ref={scope}
//         data-splitting
//         className="font-poppins mx-auto max-w-lg text-balance text-center text-xl text-white [&_.char-wrap]:inline-grid [&_.char-wrap]:overflow-hidden [&_.char]:inline-block [&_.word]:inline-block [&_.word]:whitespace-nowrap"
//       >
//         {text}
//       </div>

//       <button
//         className="absolute p-2 text-white transition-colors -translate-x-1/2 border rounded-sm bottom-5 left-1/2 border-white/30 bg-white/10 disabled:opacity-40"
//         onClick={handlePlay}
//         disabled={isPlaying}
//       >
//         <ArrowPathIcon className="size-5" />
//       </button>

//       <SelectEffect setEffect={setEffect} />
//     </Fragment>
//   );
// };

// const SelectEffect: React.FC<SelectEffectProps> = ({ setEffect }) => {
//   return (
//     <div className="absolute w-full left-5 top-5 max-w-52">
//       <Field>
//         <div className="relative">
//           <Select
//             onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
//               setEffect(event.target.value as EffectType);
//             }}
//             className={clsx(
//               'block w-full appearance-none rounded-lg border-none bg-white/5 px-3 py-1.5 text-sm/6 text-white',
//               'focus:outline-hidden data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
//               '*:text-black',
//             )}
//           >
//             {effectTypes.map((type) => {
//               return (
//                 <option
//                   key={type}
//                   value={type}
//                   className="data-focus:bg-white/10 group flex w-full items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-white"
//                 >
//                   {transformString(type)}
//                 </option>
//               );
//             })}
//           </Select>
//           <ChevronDownIcon
//             className="pointer-events-none absolute right-2.5 top-2.5 size-4 fill-white/60"
//             aria-hidden="true"
//           />
//         </div>
//       </Field>
//     </div>
//   );
// };

// export default function MultipleTextEffects() {
//   const [effect, setEffect] = useState<EffectType>('char-variation-1');
//   return (
//     <article className="relative grid p-3 border min-h-96 place-items-center rounded-xl border-white/10 bg-white/5 md:aspect-video md:min-h-0">
//       <TextEffect
//         effect={effect}
//         setEffect={setEffect}
//         text="Innovation distinguishes between a leader and a follower."
//       />
//     </article>
//   );
// }
