"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import InstallAppButton from './InstallAppButton';
import { useOverlay } from '@/context/OverlayContext';
import { useTransitionRouter } from '@/context/TransitionContext';
import { usePlayground } from '@/context/PlaygroundContext';
import navState from '@/lib/navState';
import { NAV_GROUPS, NAVIGATION_ITEMS, getNavItemsByGroup } from '@/config/navigation';
import styles from './Navbar.module.css';

/* ── Brand SVG Icons ── */
const IconGitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const IconUpwork = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-4.408 0-6.046 3.193-6.657 5.767-1.425-2.174-2.5-4.793-2.99-7.785H4.25v8.836c0 2.26 1.838 4.098 4.098 4.098 2.26 0 4.098-1.838 4.098-4.098V8.672c.484 2.052 1.474 4.542 2.893 6.442l-2.02 9.536h4.828l1.371-6.471c1.07.697 2.302 1.094 3.643 1.094 3.864 0 6.996-3.132 6.996-6.996 0-3.864-3.132-6.996-6.996-6.996z"/>
  </svg>
);

const IconLinktree = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M7.953 15.066c-.08.163-.08.324-.08.486.08.517.598.84 1.123.84.517 0 1.04-.323 1.12-.84.08-.323.08-.647-.08-.97L7.953 15.066zm4.054-4.61h1.688L16.037 7.3c.488-.534.325-1.46-.245-1.785a1.07 1.07 0 0 0-1.39.374l-2.395 4.567zm-7.627 0h1.688l-2.07-3.944a1.07 1.07 0 0 0-1.39-.374c-.57.325-.733 1.251-.245 1.785l2.017 2.533zm11.52 4.61c.325-.324.325-.647.163-.97-.162-.324-.48-.486-.81-.486-.325 0-.648.162-.81.486l-2.072 3.944c-.162.324-.162.647.08.97.163.324.48.486.81.486.163 0 .325-.08.488-.162l2.15-4.268zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.84 10.458l-5.84 8.786-5.84-8.786h2.153l3.687-6.913 3.687 6.913H17.84z"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const IconTelegram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z"/>
  </svg>
);

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const IconTryHackMe = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
    <path d="M10.705 0C7.54 0 4.902 2.285 4.349 5.291a4.525 4.525 0 0 0-4.107 4.5 4.525 4.525 0 0 0 4.52 4.52h6.761a.625.625 0 1 0 0-1.25H4.761a3.273 3.273 0 0 1-3.27-3.27A3.273 3.273 0 0 1 6.59 7.08a.625.625 0 0 0 .7-1.035 4.488 4.488 0 0 0-1.68-.69 5.223 5.223 0 0 1 5.096-4.104 5.221 5.221 0 0 1 5.174 4.57 4.489 4.489 0 0 0-.488.305.625.625 0 1 0 .731 1.013 3.245 3.245 0 0 1 1.912-.616 3.278 3.278 0 0 1 3.203 2.61.625.625 0 0 0 1.225-.251 4.533 4.533 0 0 0-4.428-3.61 4.54 4.54 0 0 0-.958.105C16.556 2.328 13.9 0 10.705 0zm5.192 10.64a.925.925 0 0 0-.462.108.913.913 0 0 0-.313.29 1.27 1.27 0 0 0-.175.427 2.39 2.39 0 0 0-.054.514c0 .181.018.353.054.517.036.164.095.307.175.43a.899.899 0 0 0 .313.297c.127.073.281.11.462.11.18 0 .334-.037.46-.11a.897.897 0 0 0 .309-.296c.08-.124.137-.267.173-.431.036-.164.054-.336.054-.517 0-.18-.018-.352-.054-.514a1.271 1.271 0 0 0-.173-.426.901.901 0 0 0-.309-.291.917.917 0 0 0-.46-.108zm6.486 0a.925.925 0 0 0-.462.108.913.913 0 0 0-.313.29 1.27 1.27 0 0 0-.175.427 2.39 2.39 0 0 0-.053.514c0 .181.017.353.053.517.036.164.095.307.175.43a.899.899 0 0 0 .313.297c.127.073.281.11.462.11.18 0 .334-.037.46-.11a.897.897 0 0 0 .31-.296c.078-.124.136-.267.172-.431.036-.164.054-.336.054-.517 0-.18-.018-.352-.054-.514a1.271 1.271 0 0 0-.173-.426.901.901 0 0 0-.308-.291.916.916 0 0 0-.461-.108zm-8.537.068l-.84.618.313.43.476-.368v1.877h.603v-2.557zm6.486 0l-.841.618.314.43.477-.368v1.877h.603v-2.557zm-4.435.445c.08 0 .143.028.193.084.05.057.087.127.114.21.026.083.044.173.054.269a2.541 2.541 0 0 1 0 .533c-.01.097-.028.187-.054.27a.584.584 0 0 1-.114.21.243.243 0 0 1-.193.085.248.248 0 0 1-.195-.086.584.584 0 0 1-.118-.209 1.245 1.245 0 0 1-.056-.27 2.645 2.645 0 0 1 0-.533c.01-.096.029-.186.056-.27a.583.583 0 0 1 .118-.209.25.25 0 0 1 .195-.084zm6.486 0c.08 0 .144.028.193.084.05.057.087.127.114.21.027.083.044.173.054.269a2.541 2.541 0 0 1 0 .533c-.01.097-.027.187-.054.27a.584.584 0 0 1-.114.21.243.243 0 0 1-.193.085.249.249 0 0 1-.195-.086.581.581 0 0 1-.117-.209 1.245 1.245 0 0 1-.056-.27 2.642 2.642 0 0 1 0-.533c.01-.096.028-.186.056-.27a.58.58 0 0 1 .117-.209.25.25 0 0 1 .195-.084zm-2.191 3.51a.93.93 0 0 0-.463.109.908.908 0 0 0-.312.291c-.08.122-.139.263-.175.426a2.383 2.383 0 0 0-.054.514c0 .18.018.353.054.516.036.164.094.308.175.432a.91.91 0 0 0 .312.296.92.92 0 0 0 .463.11c.18 0 .333-.037.46-.11a.892.892 0 0 0 .308-.296 1.32 1.32 0 0 0 .174-.432c.036-.163.054-.335.054-.516 0-.18-.018-.352-.054-.514a1.274 1.274 0 0 0-.174-.426.89.89 0 0 0-.309-.291.918.918 0 0 0-.46-.108zm-6.402.07l-.841.617.314.43.476-.369v1.878h.604v-2.557zm2.125 0l-.841.617.314.43.477-.369v1.878h.603v-2.557zm2.116 0l-.84.617.313.43.477-.369v1.878h.603v-2.557zm2.16.443c.08 0 .144.028.194.085a.605.605 0 0 1 .114.21c.026.083.044.172.053.269a2.639 2.639 0 0 1 0 .532 1.28 1.28 0 0 1-.053.27.585.585 0 0 1-.114.21.244.244 0 0 1-.193.085.25.25 0 0 1-.196-.085.589.589 0 0 1-.117-.21 1.245 1.245 0 0 1-.056-.27 2.597 2.597 0 0 1 0-.532c.01-.097.028-.186.056-.27a.589.589 0 0 1 .117-.209.249.249 0 0 1 .196-.085zm-6.729 3.073a.676.676 0 0 0-.335.078.661.661 0 0 0-.227.211.91.91 0 0 0-.127.31c-.027.118-.04.242-.04.373s.013.256.04.375a.93.93 0 0 0 .127.313.65.65 0 0 0 .227.215c.092.053.204.08.335.08a.655.655 0 0 0 .334-.08.65.65 0 0 0 .225-.215c.057-.09.1-.194.125-.313a1.75 1.75 0 0 0 .04-.375c0-.13-.014-.255-.04-.373a.931.931 0 0 0-.125-.31.658.658 0 0 0-.225-.21.667.667 0 0 0-.334-.08zm3.086 0a.675.675 0 0 0-.336.078.661.661 0 0 0-.226.211.907.907 0 0 0-.127.31 1.69 1.69 0 0 0-.04.373c0 .131.013.256.04.375a.928.928 0 0 0 .127.313c.058.09.134.162.226.215.093.053.205.08.336.08a.655.655 0 0 0 .334-.08.65.65 0 0 0 .224-.215c.058-.09.1-.194.126-.313a1.752 1.752 0 0 0 0-.748.94.94 0 0 0-.126-.31.657.657 0 0 0-.224-.21.667.667 0 0 0-.334-.08zm5.108 0a.675.675 0 0 0-.336.078.661.661 0 0 0-.226.211.91.91 0 0 0-.127.31c-.027.118-.04.242-.04.373s.013.256.04.375a.931.931 0 0 0 .127.313c.058.09.134.162.226.215.093.053.205.08.336.08.13 0 .243-.027.334-.08a.65.65 0 0 0 .224-.215c.058-.09.1-.194.126-.313a1.75 1.75 0 0 0 .04-.375c0-.13-.014-.255-.04-.373a.943.943 0 0 0-.126-.31.657.657 0 0 0-.224-.21.668.668 0 0 0-.334-.08zm-6.658.05l-.61.448.227.311.346-.266v1.362h.438v-1.856zm3.068 0l-.61.448.227.311.346-.266v1.362h.438v-1.856zm5.108 0l-.611.448.228.311.346-.266v1.362h.438v-1.856zm-9.712.322c.058 0 .105.02.14.062a.421.421 0 0 1 .083.151.96.96 0 0 1 .04.196 1.932 1.932 0 0 1 0 .386.954.954 0 0 1-.04.197.421.421 0 0 1-.083.152.176.176 0 0 1-.14.061.18.18 0 0 1-.141-.06.427.427 0 0 1-.085-.153.887.887 0 0 1-.041-.197 1.96 1.96 0 0 1 0-.386.893.893 0 0 1 .04-.196.42.42 0 0 1 .086-.151.181.181 0 0 1 .141-.062zm3.086 0c.058 0 .104.02.14.062a.421.421 0 0 1 .082.151.94.94 0 0 1 .04.196 1.906 1.906 0 0 1 0 .386.93.93 0 0 1-.04.197.421.421 0 0 1-.082.152.176.176 0 0 1-.14.061.18.18 0 0 1-.141-.06.42.42 0 0 1-.086-.153.846.846 0 0 1-.04-.197 1.965 1.965 0 0 1-.011-.195c0-.057.004-.121.01-.191a.849.849 0 0 1 .041-.196.42.42 0 0 1 .086-.151.182.182 0 0 1 .141-.062zm5.108 0c.058 0 .104.02.14.062a.421.421 0 0 1 .082.151.92.92 0 0 1 .04.196 1.963 1.963 0 0 1 0 .386.943.943 0 0 1-.04.197.421.421 0 0 1-.082.152.177.177 0 0 1-.14.061.18.18 0 0 1-.142-.06.437.437 0 0 1-.085-.153.95.95 0 0 1-.04-.197 1.965 1.965 0 0 1-.011-.195c0-.057.004-.121.01-.191a.959.959 0 0 1 .04-.196.47.47 0 0 1 .086-.151.181.181 0 0 1 .142-.062zm-1.684 1.814a.675.675 0 0 0-.336.079.66.66 0 0 0-.227.21.91.91 0 0 0-.127.31 1.731 1.731 0 0 0 0 .748.939.939 0 0 0 .127.314c.059.09.134.162.227.215.093.053.205.08.336.08a.66.66 0 0 0 .334-.08.648.648 0 0 0 .224-.215c.058-.09.1-.195.126-.314a1.737 1.737 0 0 0-.001-.747.928.928 0 0 0-.125-.31.65.65 0 0 0-.224-.211.668.668 0 0 0-.334-.079zm3.063 0a.676.676 0 0 0-.336.079.664.664 0 0 0-.227.21.906.906 0 0 0-.127.31 1.74 1.74 0 0 0 0 .748.936.936 0 0 0 .127.314.66.66 0 0 0 .227.215c.092.053.204.08.336.08a.654.654 0 0 0 .334-.08.648.648 0 0 0 .223-.215c.058-.09.1-.195.126-.314a1.74 1.74 0 0 0 0-.747.928.928 0 0 0-.126-.31.65.65 0 0 0-.223-.211.666.666 0 0 0-.334-.079zm-1.545.05l-.611.448.228.312.346-.267v1.363h.438v-1.856zm-1.518.323c.057 0 .104.02.14.061a.42.42 0 0 1 .082.152.91.91 0 0 1 .04.195 1.966 1.966 0 0 1 0 .387.951.951 0 0 1-.04.197.421.421 0 0 1-.082.152.177.177 0 0 1-.14.06.18.18 0 0 1-.142-.06.428.428 0 0 1-.085-.152.914.914 0 0 1-.04-.197 1.96 1.96 0 0 1-.011-.195c0-.058.003-.122.01-.192a.923.923 0 0 1 .041-.195c.02-.06.048-.11.085-.152a.181.181 0 0 1 .142-.061zm3.063 0c.057 0 .104.02.14.061a.42.42 0 0 1 .082.152.94.94 0 0 1 .04.195 1.91 1.91 0 0 1 0 .387.93.93 0 0 1-.04.197.422.422 0 0 1-.083.152.175.175 0 0 1-.14.06.18.18 0 0 1-.141-.06.423.423 0 0 1-.085-.152.907.907 0 0 1-.04-.197 1.95 1.95 0 0 1 0-.387.915.915 0 0 1 .04-.195c.02-.06.048-.11.085-.152a.182.182 0 0 1 .142-.061zm-9.713.185a.465.465 0 0 0-.232.055.456.456 0 0 0-.157.146.627.627 0 0 0-.089.215 1.168 1.168 0 0 0-.027.259c0 .09.009.177.027.26a.648.648 0 0 0 .089.216c.04.063.093.112.157.149a.459.459 0 0 0 .232.056c.09 0 .168-.02.231-.056a.45.45 0 0 0 .156-.149.67.67 0 0 0 .087-.217 1.218 1.218 0 0 0 0-.518.647.647 0 0 0-.087-.215.448.448 0 0 0-.156-.146.458.458 0 0 0-.23-.055zm1.052.035l-.423.31.158.217.24-.185v.944h.303v-1.286zm-1.052.224c.04 0 .073.014.097.042a.284.284 0 0 1 .057.105.69.69 0 0 1 .028.136c.004.049.007.092.007.133 0 .04-.003.086-.007.135a.684.684 0 0 1-.028.136.285.285 0 0 1-.057.105.123.123 0 0 1-.097.043.125.125 0 0 1-.098-.043.298.298 0 0 1-.059-.105.612.612 0 0 1-.028-.136 1.39 1.39 0 0 1 0-.268.62.62 0 0 1 .028-.136.297.297 0 0 1 .06-.105.125.125 0 0 1 .097-.042zm3.775 1.394a.463.463 0 0 0-.232.054.452.452 0 0 0-.157.146.621.621 0 0 0-.088.214 1.19 1.19 0 0 0 0 .519.641.641 0 0 0 .088.217.46.46 0 0 0 .157.15.458.458 0 0 0 .232.054.454.454 0 0 0 .232-.055.45.45 0 0 0 .155-.149.664.664 0 0 0 .087-.217 1.189 1.189 0 0 0 0-.519.642.642 0 0 0-.087-.214.446.446 0 0 0-.155-.146.459.459 0 0 0-.232-.054zm1.052.034l-.423.31.158.216.24-.185v.945h.303V22.68zm-1.052.223c.04 0 .073.014.098.043a.3.3 0 0 1 .057.105.643.643 0 0 1 .027.135 1.31 1.31 0 0 1 0 .268.654.654 0 0 1-.027.137.307.307 0 0 1-.057.105.124.124 0 0 1-.098.042.125.125 0 0 1-.098-.042.293.293 0 0 1-.059-.105.618.618 0 0 1-.028-.137 1.364 1.364 0 0 1 0-.268.612.612 0 0 1 .028-.135.287.287 0 0 1 .06-.105.123.123 0 0 1 .097-.043z"/>
  </svg>
);

const MOBILE_SOCIALS = [
  { href: 'https://github.com/GeniousSonu', Icon: IconGitHub, label: 'GitHub', color: '#e6edf3' },
  { href: 'https://www.linkedin.com/in/sksahinurislam/', Icon: IconLinkedIn, label: 'LinkedIn', color: '#0A66C2' },
  { href: 'https://www.upwork.com/freelancers/~0104912246c7c7bdbf', Icon: IconUpwork, label: 'Upwork', color: '#14A800' },
  { href: 'https://tryhackme.com/p/mrbettle', Icon: IconTryHackMe, label: 'TryHackMe', color: '#EA1D2C' },
  { href: 'https://t.me/genious_sonu', Icon: IconTelegram, label: 'Telegram', color: '#229ED9' },
  { href: 'https://linktr.ee/sksahinurislam', Icon: IconLinktree, label: 'Linktree', color: '#39E09B' },
  { href: 'https://www.youtube.com/@GeniousSonu', Icon: IconYouTube, label: 'YouTube', color: '#FF0000' },
];

export default function Navbar() {
  const router = useRouter();
  const transitionRouter = useTransitionRouter();
  const pathname = usePathname();
  const { activeOverlay, openOverlay, closeOverlay } = useOverlay();
  const { isPlaygroundActive, togglePlayground, isDesktop } = usePlayground();
  const mobileOpen = activeOverlay === 'nav';
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [openGroup, setOpenGroup] = useState(null); // active dropdown group ID: 'work' | 'knowledge' | 'lab' | 'about'
  const navRef = useRef(null);
  const dropdownTimerRef = useRef(null);
  const hamburgerBtnRef = useRef(null);
  const mobileNavRef = useRef(null);
  const triggerRefs = useRef({});

  // Primary navigation groups for triggers
  const triggerGroups = NAV_GROUPS.filter((g) => g.id !== 'contact');

  // Close panels on route transition
  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  const closeDropdown = useCallback(() => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenGroup(null);
  }, []);

  const openDropdown = useCallback((groupId) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenGroup(groupId);
  }, []);

  const handleGroupToggle = (e, groupId) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleGroupMouseEnter = (groupId) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      openDropdown(groupId);
    }
  };

  const handleGroupMouseLeave = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      dropdownTimerRef.current = setTimeout(() => {
        setOpenGroup(null);
      }, 200);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    };
  }, []);

  // Keyboard accessibility for group triggers and panel items
  const handleTriggerKeyDown = (e, groupId) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenGroup(groupId);
      setTimeout(() => {
        const panel = document.getElementById(`nav-panel-${groupId}`);
        const firstLink = panel?.querySelector('a');
        firstLink?.focus();
      }, 40);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpenGroup(null);
    }
  };

  const handlePanelKeyDown = (e, groupId) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpenGroup(null);
      triggerRefs.current[groupId]?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const panel = document.getElementById(`nav-panel-${groupId}`);
      const items = Array.from(panel?.querySelectorAll('a') || []);
      const currentIndex = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        const nextIndex = (currentIndex + 1) % items.length;
        items[nextIndex]?.focus();
      } else {
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        items[prevIndex]?.focus();
      }
    }
  };

  // Sync body class for mobile nav active styles
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mobileOpen) {
        document.body.classList.add('mobile-nav-active');
      } else {
        document.body.classList.remove('mobile-nav-active');
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('mobile-nav-active');
      }
    };
  }, [mobileOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollToPlugin);
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 40);

      if (currentY > 120 && currentY > lastY + 6) {
        setHidden(true);
      } else if (currentY < lastY - 6 || currentY <= 40) {
        setHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const closeMobileNav = useCallback(() => {
    closeOverlay('nav');
    hamburgerBtnRef.current?.focus();
  }, [closeOverlay]);

  // Handle focus trapping and keyboard shortcuts when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      const timer = setTimeout(() => {
        const closeBtn = mobileNavRef.current?.querySelector('#mobile-nav-close');
        closeBtn?.focus();
      }, 60);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeMobileNav();
          hamburgerBtnRef.current?.focus();
          return;
        }

        if (e.key === 'Tab') {
          const focusables = Array.from(
            mobileNavRef.current?.querySelectorAll(
              'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            ) || []
          );
          if (focusables.length === 0) return;

          const firstEl = focusables[0];
          const lastEl = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              e.preventDefault();
              lastEl.focus();
            }
          } else {
            if (document.activeElement === lastEl) {
              e.preventDefault();
              firstEl.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileOpen, closeMobileNav]);

  // Prefetch routes when mobile menu opens
  useEffect(() => {
    if (!mobileOpen) return;
    const timer = setTimeout(() => {
      const routeItems = NAVIGATION_ITEMS.filter((item) => item.type === 'page').map((item) => item.href);
      routeItems.forEach((href) => {
        try { router.prefetch(href); } catch {}
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [mobileOpen, router]);

  const scrollToSectionWithOffset = (targetSelector) => {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const navHeight = 75;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth',
    });
  };

  const handleLinkClick = (e, targetHref) => {
    e.preventDefault();
    closeOverlay('nav');
    setOpenGroup(null);

    if (targetHref === '#' || targetHref === '/') {
      if (pathname === '/') {
        navState.startAnchorNav();
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      } else {
        transitionRouter.push('/');
      }
      return;
    }

    if (targetHref.startsWith('/#')) {
      const anchor = targetHref.replace('/', '');
      if (pathname === '/') {
        navState.startAnchorNav();
        setTimeout(() => {
          scrollToSectionWithOffset(anchor);
        }, 60);
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', anchor);
        }
        transitionRouter.push(targetHref);
      }
      return;
    }

    if (targetHref.startsWith('#')) {
      if (pathname === '/') {
        navState.startAnchorNav();
        setTimeout(() => {
          scrollToSectionWithOffset(targetHref);
        }, 60);
      } else {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('portfolio_scroll_target', targetHref);
        }
        transitionRouter.push('/' + targetHref);
      }
      return;
    }

    if (targetHref.startsWith('/')) {
      navState.startRouteNav();
      transitionRouter.push(targetHref);
    }
  };

  // Scroll to section when arriving on homepage
  useEffect(() => {
    if (pathname === '/') {
      const storedTarget = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('portfolio_scroll_target') : null;
      const hashTarget = window.location.hash;
      const target = storedTarget || hashTarget;
      if (target && target.startsWith('#')) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.removeItem('portfolio_scroll_target');
        }
        const timer = setTimeout(() => {
          scrollToSectionWithOffset(target);
        }, 350);
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  return (
    <>
      <nav
        id="nav"
        ref={navRef}
        className={`${scrolled ? 'scrolled' : ''} ${hidden ? 'nav-hidden' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-inner">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => handleLinkClick(e, '/')}
            className="nav-logo"
            aria-label="SK Sahinur Islam — Home"
          >
            <Image src="/logo.svg" alt="SONU" width={90} height={26} priority className="nav-logo-img" />
          </Link>

          {/* Desktop Links (5 Groups + All Pages + Contact CTA) */}
          <ul className="nav-links" role="list">
            {triggerGroups.map((group) => {
              const groupItems = getNavItemsByGroup(group.id);
              const isGroupActive = groupItems.some((item) => {
                if (item.type === 'page') return pathname === item.href || pathname.startsWith(item.href + '/');
                return false;
              });
              const isOpen = openGroup === group.id;

              return (
                <li
                  key={group.id}
                  className="nav-dropdown-wrapper"
                  onMouseEnter={() => handleGroupMouseEnter(group.id)}
                  onMouseLeave={handleGroupMouseLeave}
                >
                  <button
                    ref={(el) => (triggerRefs.current[group.id] = el)}
                    type="button"
                    className={`nav-dropdown-trigger ${isGroupActive ? 'active' : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={`nav-panel-${group.id}`}
                    aria-haspopup="true"
                    aria-label={`${group.label} menu`}
                    onClick={(e) => handleGroupToggle(e, group.id)}
                    onKeyDown={(e) => handleTriggerKeyDown(e, group.id)}
                  >
                    <span>{group.label}</span>
                    <svg
                      className="nav-dropdown-caret"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div
                      id={`nav-panel-${group.id}`}
                      className={styles.dropdownMenu}
                      role="menu"
                      aria-label={`${group.label} pages`}
                      onMouseEnter={() => handleGroupMouseEnter(group.id)}
                      onMouseLeave={handleGroupMouseLeave}
                      onKeyDown={(e) => handlePanelKeyDown(e, group.id)}
                    >
                      <div className={styles.panelHeader}>{group.description}</div>
                      {groupItems.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          role="menuitem"
                          className={styles.dropdownItem}
                          onClick={(e) => handleLinkClick(e, item.href)}
                        >
                          <div className={styles.itemTop}>
                            <span className={styles.itemLabel}>{item.label}</span>
                            {item.status === 'stub' ? (
                              <span className={`${styles.itemTag} ${styles.itemTagStub}`}>STUB</span>
                            ) : item.type === 'anchor' ? (
                              <span className={styles.itemTag}>#section</span>
                            ) : null}
                          </div>
                          <span className={styles.itemDesc}>{item.description}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}

            {/* "All pages" modal trigger */}
            <li>
              <button
                type="button"
                className={styles.allPagesBtn}
                onClick={() => openOverlay('site_menu')}
                aria-label="Open all pages directory"
                title="View complete site directory"
              >
                <span>Index</span>
                <span className={styles.itemTag}>All</span>
              </button>
            </li>

            {/* Contact CTA */}
            <li>
              <a
                href="/contact"
                onClick={(e) => handleLinkClick(e, '/contact')}
                className="nav-cta"
              >
                Contact →
              </a>
            </li>
          </ul>

          {/* Playground Toggle */}
          {isDesktop && (
            <button
              className={`nav-cmdk-btn ${isPlaygroundActive ? 'ring-2 ring-emerald-500 text-emerald-400' : ''}`}
              onClick={togglePlayground}
              aria-label="Toggle Playground Mode"
              title="Playground Mode (Editable & Draggable)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          )}

          {/* Command Palette Trigger */}
          <button
            className="nav-cmdk-btn"
            onClick={() => {
              openOverlay('palette');
            }}
            aria-label="Open Command Palette (Cmd+K)"
            title="Search & Commands (⌘K)"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span className="nav-cmdk-badge">⌘K</span>
          </button>

          {/* Install App Button */}
          <InstallAppButton />

          {/* Hamburger — animated 3-bar → X */}
          <button
            ref={hamburgerBtnRef}
            className={`nav-hamburger${mobileOpen ? ' is-open' : ''}`}
            id="hamburger-btn"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => {
              if (mobileOpen) {
                closeMobileNav();
              } else {
                openOverlay('nav');
              }
            }}
          >
            <span className="ham-bar ham-bar--top" />
            <span className="ham-bar ham-bar--mid" />
            <span className="ham-bar ham-bar--bot" />
          </button>
        </div>
      </nav>

      {/* ── Full-Screen Mobile Nav ── */}
      <div
        ref={mobileNavRef}
        id="mobile-nav"
        className={mobileOpen ? 'open' : ''}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!mobileOpen}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="mnav-glow" aria-hidden="true" />

        {/* Close button */}
        <button
          id="mobile-nav-close"
          aria-label="Close navigation menu"
          onClick={closeMobileNav}
        >
          <span className="ham-bar ham-bar--top" />
          <span className="ham-bar ham-bar--bot" />
        </button>

        {/* Mobile Quick Search / Cmd+K Pill & All Pages Trigger */}
        <div className="mnav-cmdk-box" style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '520px' }}>
          <button
            className="mnav-cmdk-btn"
            style={{ flex: 1 }}
            onClick={() => {
              closeMobileNav();
              setTimeout(() => {
                openOverlay('palette');
              }, 80);
            }}
            aria-label="Search & Commands"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Search &amp; Commands</span>
            <span className="nav-cmdk-badge">⌘K</span>
          </button>

          <button
            className="mnav-cmdk-btn"
            style={{ width: 'auto', padding: '0 0.85rem' }}
            onClick={() => {
              closeMobileNav();
              setTimeout(() => {
                openOverlay('site_menu');
              }, 80);
            }}
            aria-label="All Pages"
          >
            <span>All Pages</span>
          </button>
        </div>

        {/* Sectioned Group Navigation from navigation.js */}
        <div className={styles.mobileGroups}>
          {NAV_GROUPS.map((group) => {
            const items = getNavItemsByGroup(group.id);
            return (
              <div key={group.id} className={styles.mobileGroup}>
                <div className={styles.mobileGroupTitle}>
                  <span>{'//'}</span>
                  <span>{group.label}</span>
                </div>
                <div className={styles.mobileGroupGrid}>
                  {items.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className={styles.mobileItemCard}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      tabIndex={mobileOpen ? 0 : -1}
                    >
                      <div className={styles.mobileItemTitle}>
                        <span>{item.label}</span>
                        {item.status === 'stub' && <span className={styles.itemTagStub}>STUB</span>}
                      </div>
                      <span className={styles.mobileItemDesc}>{item.description}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Install App Button */}
        <div className="mnav-install-box">
          <InstallAppButton isMobileMenu={true} />
        </div>

        {/* Social icons row */}
        <div className="mnav-socials">
          {MOBILE_SOCIALS.map(({ href, Icon, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mnav-social-btn"
              aria-label={label}
              style={{ '--icon-color': color }}
              tabIndex={mobileOpen ? 0 : -1}
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Bottom tag */}
        <div className="mnav-tag">
          <span style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>sahinur</span>
          <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>@dev</span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>:~$</span>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="mnav-backdrop"
          aria-hidden="true"
          onClick={closeMobileNav}
        />
      )}
    </>
  );
}
