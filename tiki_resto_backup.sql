--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: seafood_orders_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.seafood_orders_status_enum AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'ready',
    'completed',
    'cancelled'
);


ALTER TYPE public.seafood_orders_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: carte_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carte_items (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    price numeric(10,2) NOT NULL,
    "imagePath" character varying,
    category character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.carte_items OWNER TO postgres;

--
-- Name: carte_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carte_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carte_items_id_seq OWNER TO postgres;

--
-- Name: carte_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carte_items_id_seq OWNED BY public.carte_items.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    date character varying NOT NULL,
    "time" character varying NOT NULL,
    capacity character varying NOT NULL,
    "imagePath" character varying,
    type character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: gallery_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gallery_items (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying,
    "imagePath" character varying NOT NULL,
    category character varying NOT NULL,
    "displayOrder" integer DEFAULT 999 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.gallery_items OWNER TO postgres;

--
-- Name: gallery_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gallery_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gallery_items_id_seq OWNER TO postgres;

--
-- Name: gallery_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gallery_items_id_seq OWNED BY public.gallery_items.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    price numeric(10,2) NOT NULL,
    "imagePath" character varying,
    category character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_items_id_seq OWNER TO postgres;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: menus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menus (
    id integer NOT NULL,
    name character varying NOT NULL,
    price character varying NOT NULL,
    items text NOT NULL,
    info character varying,
    highlight boolean DEFAULT false NOT NULL
);


ALTER TABLE public.menus OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menus_id_seq OWNER TO postgres;

--
-- Name: menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menus_id_seq OWNED BY public.menus.id;


--
-- Name: personnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personnel (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    service character varying NOT NULL,
    role character varying NOT NULL,
    description text,
    speciality character varying,
    experience character varying,
    schedule character varying,
    "imagePath" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.personnel OWNER TO postgres;

--
-- Name: personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personnel_id_seq OWNER TO postgres;

--
-- Name: personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personnel_id_seq OWNED BY public.personnel.id;


--
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id integer NOT NULL,
    "customerName" character varying NOT NULL,
    "customerEmail" character varying NOT NULL,
    "customerPhone" character varying NOT NULL,
    "numberOfGuests" integer NOT NULL,
    "reservationDateTime" timestamp without time zone NOT NULL,
    "specialRequests" character varying,
    "userId" integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "isEvent" boolean DEFAULT false,
    "tableNumber" integer,
    "isArrived" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- Name: reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservation_id_seq OWNER TO postgres;

--
-- Name: reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_id_seq OWNED BY public.reservation.id;


--
-- Name: seafood_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seafood_order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "productId" character varying NOT NULL,
    name character varying NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "isHalfDozen" boolean DEFAULT false NOT NULL,
    order_id uuid
);


ALTER TABLE public.seafood_order_items OWNER TO postgres;

--
-- Name: seafood_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seafood_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "customerName" character varying NOT NULL,
    "customerPhone" character varying NOT NULL,
    "customerEmail" character varying,
    "pickupDate" date NOT NULL,
    "pickupTime" character varying NOT NULL,
    "isPickup" boolean DEFAULT true NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "specialRequests" text,
    status public.seafood_orders_status_enum DEFAULT 'pending'::public.seafood_orders_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.seafood_orders OWNER TO postgres;

--
-- Name: seafood_plateaux; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seafood_plateaux (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "plateauId" character varying NOT NULL,
    name character varying NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    order_id uuid
);


ALTER TABLE public.seafood_plateaux OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    phone_number character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wines (
    id integer NOT NULL,
    name character varying NOT NULL,
    region character varying NOT NULL,
    category character varying NOT NULL,
    "bottlePrice" character varying NOT NULL,
    "glassPrice" character varying
);


ALTER TABLE public.wines OWNER TO postgres;

--
-- Name: wines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.wines_id_seq OWNER TO postgres;

--
-- Name: wines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wines_id_seq OWNED BY public.wines.id;


--
-- Name: carte_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carte_items ALTER COLUMN id SET DEFAULT nextval('public.carte_items_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: gallery_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items ALTER COLUMN id SET DEFAULT nextval('public.gallery_items_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus ALTER COLUMN id SET DEFAULT nextval('public.menus_id_seq'::regclass);


--
-- Name: personnel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel ALTER COLUMN id SET DEFAULT nextval('public.personnel_id_seq'::regclass);


--
-- Name: reservation id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation ALTER COLUMN id SET DEFAULT nextval('public.reservation_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wines ALTER COLUMN id SET DEFAULT nextval('public.wines_id_seq'::regclass);


--
-- Data for Name: carte_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carte_items (id, name, description, price, "imagePath", category, "createdAt", "updatedAt") FROM stdin;
16	Tartare de boeuf	Frites fraiches & Bouquet de salade	21.00	/uploads/images/789e4106a9510e5758f1323d62a1bf0392.jpeg	plats	2025-04-15 09:57:18.581267	2025-05-05 09:41:41.047267
4	Tataki de thon en croute de sésame	Sauce thaï, champignons sautés et légume croquants façon wok	22.00	/images/11089de9dd601532210ee8f589437272a1.jpeg	plats	2025-04-07 10:28:25.67227	2025-04-07 10:28:38.723787
5	Panier Asiatique	Nems de poulet, gyozas de boeuf, samoussas aux légumes salade verte et menthe fraiche	14.00	/images/9ff10b177cae9a05defaf717122fe921b.jpeg	entrees	2025-04-07 10:29:50.624896	2025-04-07 10:29:50.624896
6	Brioche perdue Nanterre	Boule de glace & caramel beurre salé	8.00	/images/4fdb03a296c2d1a4cbcc4ac9692723ab.jpeg	desserts	2025-04-07 10:30:50.10425	2025-04-07 10:30:50.10425
7	Pornstar Martini	 	10.00	/images/241037c6a8d505d910602179dd55758640.jpeg	boissons	2025-04-07 10:32:27.146784	2025-04-07 10:32:27.146784
8	Mojito	 	10.00	/images/a9a6dc619df4eb10e283b5ed17f6ce499.jpeg	boissons	2025-04-07 10:32:58.660028	2025-04-07 10:32:58.660028
12	Burger du moment	Frites maison et bouquet de salade	18.00		plats	2025-04-15 09:54:38.963032	2025-04-15 09:54:38.963032
13	Cigaline de cochon grillée, jus corsé à la spianata	Pommes de terre grenaille et légume rôtis	19.00		plats	2025-04-15 09:55:20.542757	2025-04-15 09:55:20.542757
14	Onglet de boeuf en canon	Frites maison et bouquet de salade	22.00		plats	2025-04-15 09:56:00.042094	2025-04-15 09:56:00.042094
9	Planche de Charcuterie	Jambon Speck, Mortadelle IGP Bologne pistache, Spianata Romana,\nSpianata Piccante, Jambon cuit truffé, Pecorino primosale piment, Grissini	18.00	/uploads/images/772b42c63da9727226bec7b839883866.jpeg	entrees	2025-04-15 09:43:37.87421	2025-04-15 10:00:22.960005
18	Houmous maison, seul ou à partager avec son pain grillé	Pois chiches, menthe fraiche, jus de citron, piment d'Espelette	11.00		entrees	2025-04-15 10:01:43.21688	2025-04-15 10:01:54.08975
19	Calamars de Patagonia croustillants	Emincé de calamars frits, piment d'Espelette et sauce aïoli	12.00		entrees	2025-04-15 10:02:43.633719	2025-04-15 10:02:43.633719
26	Café / Thé gourmand	 	9.00		desserts	2025-04-15 10:07:05.211678	2025-04-15 10:07:11.627026
27	Pina Colada	 	10.00	/uploads/images/470c15c1029e9ea889de0a5b454d505810.jpeg	boissons	2025-04-15 10:07:57.376699	2025-04-15 10:07:57.376699
28	Sex on the beach	 	10.00		boissons	2025-04-15 10:08:16.693426	2025-04-15 10:08:16.693426
29	Cuba Libre	 	9.00		boissons	2025-04-15 10:08:24.852247	2025-04-15 10:08:24.852247
30	Caiprinha	 	9.00	/uploads/images/cee83adb19c4d2864424de84bfad5c66.jpeg	boissons	2025-04-15 10:08:48.738122	2025-04-15 10:08:48.738122
31	Moscow / London Mule	 	10.00		boissons	2025-04-15 10:09:34.924974	2025-04-15 10:09:34.924974
32	Cocktail de fruits Sans Alcool	 	8.00		boissons	2025-04-15 10:09:53.326615	2025-04-15 10:09:53.326615
33	Friture d'eperlan	accompagné de sa sauce tartare	12.00		entrees	2025-05-05 09:16:28.506401	2025-05-05 09:16:28.506401
20	Salade de chèvre chaud	Segments d'agrumes, mélange de graines	14.00		entrees	2025-04-15 10:03:48.898331	2025-05-05 09:26:35.070327
37	Tartare de thon facon tahitienne	Frites fraiches & Bouquet de salade	21.00	/uploads/images/c721dfa717dde5e2e71f95683107c5239.jpeg	plats	2025-05-05 09:42:18.76452	2025-05-05 09:42:18.76452
22	Poke Bowl	Vermicelle, Avocats, Carotte, Thon, Radis	13.00		entrees	2025-04-15 10:04:53.680678	2025-05-05 09:30:30.493234
1	Tataki de boeuf	A l'italienne	12.00		entrees	2025-04-02 16:02:20.165799	2025-05-05 09:31:15.506064
17	Risotto de coquillettes	Chiffonade de jambon truffé & oeuf parfait	22.00		plats	2025-04-15 09:58:17.206062	2025-05-05 09:34:11.087883
15	Steak d'espadon	Beurre blanc citronné, accompagnement du moment	26.00		plats	2025-04-15 09:56:37.079427	2025-05-05 09:34:46.104815
34	Tentacule de poulpe	Houmous, Pommes grenailles & ses légumes du soleil	26.00		plats	2025-05-05 09:35:30.217754	2025-05-05 09:35:30.217754
35	Tartaki	Tartare de boeuf et Tataki de boeuf 380g, frites fraiches, bouquet de salade	39.00	/uploads/images/cccba0db20dfc054e847947d1410686a6.jpeg	plats	2025-05-05 09:36:39.593475	2025-05-05 09:37:17.12341
21	Tartare de thon facon tahitienne	Bouquet de salade	12.00	/uploads/images/df53af10398810942105f715365aff7764b.jpeg	entrees	2025-04-15 10:04:35.447951	2025-05-05 09:38:33.714076
36	Tataki de boeuf	A l'italienne	22.00	/uploads/images/b2d11f735d365047d9b2a31102653c86e.jpeg	plats	2025-05-05 09:39:47.460528	2025-05-05 09:39:47.460528
2	Sablé breton	 	8.00	/images/67143f6645c1036a95188696cf4820ffb.jpeg	desserts	2025-04-02 16:04:35.886206	2025-05-13 09:23:28.35523
24	Tiramisu du moment	 	8.00		desserts	2025-04-15 10:06:19.094565	2025-05-13 09:23:44.895572
25	Coulant au chocolat	Glace framboise	8.00		desserts	2025-04-15 10:06:50.74541	2025-05-13 09:23:59.626484
38	Tomates Burrata	 	17.00	/uploads/images/52b51ba198de26d6b98cfbc6ac961f28.jpeg	entrees	2025-05-13 09:34:38.811429	2025-05-13 09:34:38.811429
11	Cuissse de grenouilles comme en Dombes	Pommes de terre grenaille	29.00	/uploads/images/227d5ed32076dd59af8a54c88fdd8de6.jpeg	plats	2025-04-15 09:53:13.845296	2025-05-13 09:40:07.882748
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, date, "time", capacity, "imagePath", type, "createdAt", "updatedAt") FROM stdin;
3	Soirée Tapas	 	2025-05-16	20:00	140	/images/c6410f3f48be8978bcb3aeb256c22d799.jpeg	tapas	2025-04-07 10:35:02.216873	2025-04-07 10:35:02.216873
5	Soirée Spectacle de dauphins	Venez profiter d'un moment chaleureux	2025-04-25	20:00	120	/images/cc4816e68e79c2ecdcb1914a0378c2b1.jpeg	brasero	2025-04-07 17:00:27.422741	2025-04-22 11:19:19.678413
\.


--
-- Data for Name: gallery_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gallery_items (id, title, description, "imagePath", category, "displayOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
3	Couché de Soleil 	Vue sur la mer	/images/9aea7eb0eed4d9271dbed69188eac988.jpeg	restaurant	999	t	2025-04-07 10:19:35.13405	2025-04-07 10:19:35.13405
4	Véranda du Tiki	Avec une vue sur le grand large	/images/ce410ff1810fd6b8184a6e213e55946ef9.jpeg	restaurant	999	t	2025-04-07 10:20:16.829645	2025-04-07 10:20:16.829645
5	Notre Bar d'exception		/images/e729991013e6ed7deb57a36819ea2ee110.jpeg	restaurant	999	t	2025-04-07 10:21:40.199195	2025-04-07 10:21:40.199195
6	Crème Brulée		/images/495a9259a3fe8784840547ed482333ee.jpeg	dishes	999	t	2025-04-07 10:22:15.361838	2025-04-07 10:22:15.361838
7	Brioche Perdue		/images/e4a171e7cad3c22b71080b6284b590934.jpeg	dishes	999	t	2025-04-07 10:22:30.181217	2025-04-07 10:22:30.181217
9	Panier Asiatique		/images/6a6a641312986e7f22161ffac8612fd2.jpeg	dishes	999	t	2025-04-07 10:23:15.313698	2025-04-07 10:24:32.759726
8	Tataki de Thon		/images/9f1299e29624a5fd724da0f5b69ac86f.jpeg	dishes	999	t	2025-04-07 10:22:54.040967	2025-04-07 10:24:55.025876
11	Table près de la mer	Profiter d'un moment entre amis ou en famille	/uploads/images/d7301a4d7ad1b10d25b28c8425d109bc3d.jpeg	restaurant	999	t	2025-04-15 09:40:55.212408	2025-04-15 09:40:55.212408
12	Vue imprenable	Profiter de notre vue magnifique sur le Grand Large	/uploads/images/149d2bfbfec259d8db52bd46a9d8d453.jpeg	restaurant	999	t	2025-04-15 09:41:44.191853	2025-04-15 09:41:44.191853
13	Couché de Soleil	Profiter de notre plus beau couché de soleil	/uploads/images/40af5a8cb068c0c1ed4f495fbc61c455.jpeg	restaurant	999	t	2025-04-15 09:42:22.043114	2025-04-15 09:42:22.043114
14	Cote de boeuf	Préparation au brasero	/uploads/images/4e86886201bd706b28b6da3f54b1d734.jpg	dishes	999	t	2025-04-22 11:53:28.675677	2025-04-22 11:53:28.675677
15	Veranda	Avec vue sur la mer	/uploads/images/4235ddab1010721e184f546fb1672f24e3.jpg	restaurant	999	t	2025-05-13 09:47:29.446992	2025-05-13 09:47:29.446992
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, name, description, price, "imagePath", category, "createdAt", "updatedAt") FROM stdin;
6	test	test	18.00	/images/10f10238e768e888f7fc13d1a4a4e7cba1.jpeg	entrees	2025-04-02 13:21:01.623584	2025-04-02 13:21:01.623584
7	test	test	18.00	/images/6fc1698a9a9d7449ce24a4ad61fbd9bc.jpeg	entrees	2025-04-02 15:28:27.735889	2025-04-02 15:28:27.735889
8	test	test	28.00	/images/a6fbdfda1d39ec7ed1091f3528a817ca8.jpeg	entrees	2025-04-02 15:54:37.477656	2025-04-02 15:54:37.477656
\.


--
-- Data for Name: menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menus (id, name, price, items, info, highlight) FROM stdin;
1	Menu Grenouilles à volonté	35€	Velouté de Butternut ou Paté en croûte,  Bouquet de salade,Grenouilles à volonté,Mousse au chocolat ou Tarte fine aux pommes	Disponible le vendredi soir et le week-end	t
2	Menu Affaire	24€	2 Entrées au choix,Viande ou Poisson,2 Desserts au choix	Disponible le midi du mardi au vendredi	f
\.


--
-- Data for Name: personnel; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personnel (id, "firstName", "lastName", service, role, description, speciality, experience, schedule, "imagePath", "createdAt", "updatedAt") FROM stdin;
2	Quentin	Cialone	salle	Responsable de Salle	Membre de l'équipe Tiki	Non spécifié	Non spécifié	Non spécifié	/images/cfdca03868de56d28c9206eee6b6534f.jpeg	2025-04-07 11:09:23.259433	2025-04-07 11:09:23.259433
1	Greg	Maire	salle	Patron 	Membre de l'équipe Tiki	Non spécifié	Non spécifié	Non spécifié	/images/b10da1b1ac7746398b13b4a58d4fa284c.jpeg	2025-04-07 09:47:07.16143	2025-04-07 09:47:07.161
5	Sylvain	Alias Sly	cuisine	Chef de cuisine	Membre de l'équipe Tiki	Non spécifié	Non spécifié	Non spécifié	/uploads/images/9da8468b6104b33dc6a3c20ff2b99689e.jpeg	2025-04-15 09:39:53.905795	2025-04-15 09:39:53.905795
6	Alexis	Berthier	salle	Directeur de salle	Membre de l'équipe Tiki	Non spécifié	Non spécifié	Non spécifié	/uploads/images/dfb7602361eb709c8c26a04c7e94056e.jpeg	2025-05-13 09:46:03.750746	2025-05-13 09:46:03.750746
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation (id, "customerName", "customerEmail", "customerPhone", "numberOfGuests", "reservationDateTime", "specialRequests", "userId", created_at, updated_at, "isEvent", "tableNumber", "isArrived") FROM stdin;
6	Cialone Quentin	cialonequentin@gmail.com	0709080706	2	2025-04-15 12:30:00		\N	2025-04-16 09:30:44.055003	2025-04-16 09:30:44.055003	f	\N	f
7	Alexis Berthier	cialonequentin@gmail.com	0709080706	7	2025-04-15 12:30:00		1	2025-04-16 09:30:44.055003	2025-04-16 09:30:44.055003	f	\N	f
8	Cialone Quentin	cialonequentin@gmail.com	0612345678	7	2025-04-15 13:30:00		4	2025-04-16 09:30:44.055003	2025-04-16 09:30:44.055003	f	\N	f
9	Alexis Berthier	cialonequentin@gmail.com	0709080706	8	2025-04-16 12:45:00		\N	2025-04-16 09:32:03.535744	2025-04-16 09:32:03.535744	f	\N	f
41	TEST	cialonequentin@gmail.com	0709080706	2	2025-04-29 14:30:00		\N	2025-04-27 01:34:01.54294	2025-04-28 16:41:07.073945	f	\N	f
42	Quentin	cialonequentin@gmail.com	0662495424	7	2025-05-01 19:30:00		3	2025-04-30 23:24:45.590138	2025-04-30 23:24:45.590138	f	\N	f
49	Cialone Quentin	cialonequentin@gmail.com	0662495424	7	2025-05-06 20:45:00		\N	2025-05-06 15:52:42.045503	2025-05-06 15:52:42.045503	f	\N	f
50	Cialone Quentin	cialonequentin@gmail.com	0662495424	7	2025-05-06 20:00:00		\N	2025-05-06 15:57:52.352344	2025-05-06 15:57:52.352344	f	\N	f
11	Cialone Quentin	cialonequentin@gmail.com	0709080706	10	2025-04-16 12:30:00		3	2025-04-16 10:56:26.239835	2025-04-16 17:25:23.127709	f	\N	f
19	Quentin	cialonequentin@gmail.com	0662495424	2	2025-04-17 19:00:00		3	2025-04-17 14:30:56.971072	2025-04-17 14:30:56.971072	f	\N	f
23	Quentin	cialonequentin@gmail.com	0662495424	2	2025-04-18 19:15:00		3	2025-04-18 15:51:41.881068	2025-04-18 15:51:41.881068	f	\N	f
24	Quentin	reservation@telephone.com	0662495424	8	2025-04-24 14:00:00		\N	2025-04-23 13:38:55.40389	2025-04-23 22:02:09.717082	f	\N	f
25	Alexis Berthier	reservation@telephone.com	0783287826	6	2025-04-24 21:00:00		\N	2025-04-24 14:31:42.127573	2025-04-24 14:31:42.127573	f	\N	f
26	Cialone Quentin	cialonequentin@gmail.com	0662495424	7	2025-04-24 19:45:00		\N	2025-04-24 14:32:13.41825	2025-04-24 14:32:13.41825	f	\N	f
28	Cialone Quentin	cialonequentin@gmail.com	0709080706	6	2025-04-25 20:00:00		\N	2025-04-25 01:34:45.240314	2025-04-25 01:36:00.236724	f	\N	f
29	Cialone Quentin	cialonequentin@gmail.com	0662495424	2	2025-04-26 20:45:00		\N	2025-04-25 01:40:48.925004	2025-04-25 01:40:48.925004	f	\N	f
30	Cialone Quentin	cialonequentin@gmail.com	0662495424	8	2025-04-26 20:45:00		\N	2025-04-25 01:45:12.67025	2025-04-25 01:45:12.67025	f	\N	f
31	CialoneCamille	cialonequentin@gmail.com	0783287826	20	2025-04-26 03:55:00	ÉVÉNEMENT #1/10 (200 pers. total) - Type: private -  	\N	2025-04-25 01:57:04.698763	2025-04-25 01:57:04.698763	f	\N	f
34	Cialone Quentin	cialonequentin@gmail.com	0709080706	20	2025-04-25 05:00:00	ÉVÉNEMENT #1/2 (25 pers. total) - Type: special - 	\N	2025-04-25 02:00:09.98431	2025-04-25 02:00:09.98431	f	\N	f
35	Cialone Quentin	cialonequentin@gmail.com	0709080706	5	2025-04-25 05:00:00	ÉVÉNEMENT #2/2 (25 pers. total) - Type: special	\N	2025-04-25 02:00:10.271238	2025-04-25 02:00:10.271238	f	\N	f
38	Greg Maire	cialonequentin@gmail.com	0709080706	11	2025-04-26 12:30:00		\N	2025-04-26 11:39:36.521481	2025-04-26 11:39:36.521481	f	\N	f
39	Cialone Quentin	cialonequentin@gmail.com	0709080706	8	2025-04-26 12:45:00		\N	2025-04-26 11:40:08.922915	2025-04-26 11:40:08.922915	f	\N	f
40	TEST	reservation@telephone.com	0709080706	2	2025-05-02 12:30:00		\N	2025-04-27 01:11:03.4368	2025-04-27 01:11:03.4368	f	\N	f
44	Quentin	cialonequentin@gmail.com	0662495424	5	2025-05-05 22:00:00		3	2025-05-05 16:01:57.364974	2025-05-05 16:02:57.889746	f	\N	f
36	Cialone Quentin	cialonequentin@gmail.com	0662495424	20	2025-06-20 14:32:00	ÉVÉNEMENT #1/3 (55 pers. total) - Type: private - Type: private - 	\N	2025-04-25 13:32:45.304072	2025-04-28 15:04:15.690201	t	\N	f
43	Quentin	cialonequentin@gmail.com	0662495424	6	2025-05-06 01:15:00		3	2025-05-05 15:07:55.383433	2025-05-06 16:44:51.637296	f	145	f
47	Cialone Quentin	cialonequentin@gmail.com	0662495424	2	2025-05-06 19:15:00		\N	2025-05-06 15:40:13.192311	2025-05-06 16:44:52.739387	f	135	f
53	TEST	cialonequentin@gmail.com	0709080706	8	2025-05-13 19:30:00	[Réservation groupe: 8 personnes]	\N	2025-05-13 10:36:01.51969	2025-05-13 10:36:01.51969	f	\N	f
45	Quentin	cialonequentin@gmail.com	0662495424	8	2025-05-15 14:30:00		3	2025-05-06 09:47:30.580488	2025-05-13 10:36:34.990857	f	135	f
54	Cialone Quentin	cialonequentin@gmail.com	0662495424	7	2025-05-16 12:30:00		\N	2025-05-13 10:45:15.09094	2025-05-13 10:45:15.09094	f	\N	f
52	Cialone Quentin	cialonequentin@gmail.com	0612345678	7	2025-05-13 14:00:00		\N	2025-05-13 10:35:29.306545	2025-05-13 10:47:00.846735	f	0	f
48	Cialone Quentin	cialonequentin@gmail.com	0662495424	2	2025-05-06 19:15:00		\N	2025-05-06 15:50:48.064431	2025-05-06 15:50:48.064431	f	\N	f
\.


--
-- Data for Name: seafood_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seafood_order_items (id, "productId", name, quantity, "unitPrice", "isHalfDozen", order_id) FROM stdin;
fa248aad-07c2-432d-9d39-c6394e3d66df	crevette-grise	Crevette grise fraîches les 100g	1	12.00	f	9360cf65-04cc-4146-a80c-ff6603600604
1a3f3c9f-a590-4861-b3ca-0b2d14a61e83	fines	Fines de claire (12 ou 6)	2	24.00	f	3499864c-28c8-43bc-ad72-6add4c4b104a
7ec40f76-a30e-4135-a6d7-ff34dda92a51	tourteau	Tourteau entier frais & sa mayonnaise	1	39.90	f	4b2af0d8-4a00-4677-bb44-d30c05efae53
28435b2a-def4-4b21-b79a-7eebef5cdd2e	homard	Homard entier frais & sa mayonnaise	1	71.00	f	4b2af0d8-4a00-4677-bb44-d30c05efae53
f0bdbb45-0e1c-4bae-abb0-46f81c34396d	fines	Fines de claire (12 ou 6)	1	24.00	f	588d0b3a-1929-412d-a0ce-fe376766850d
9d1ec063-b172-46b1-a522-a2568416867a	homard	Homard entier frais & sa mayonnaise	1	71.00	f	588d0b3a-1929-412d-a0ce-fe376766850d
649722aa-82ca-401c-b3fa-e969cd32cd82	crevettes	Bouquet de crevettes (6)	1	12.00	f	cbff4376-8016-4037-bea3-5c27206d205f
beaf450b-ad71-4a48-9297-0b1a393864b1	tourteau	Tourteau entier frais & sa mayonnaise	1	39.90	f	cbff4376-8016-4037-bea3-5c27206d205f
e7db4c9c-3086-497e-9d9e-1de99d27956a	bulots	Bulots (300g)	1	14.00	f	50019cf5-2578-4207-a3a6-9e7da21e0042
f53cac3b-9bb1-4575-8fd6-6472a1641b7b	bulots	Bulots (300g)	1	14.00	f	9a314509-e7cc-4b1d-91e2-0bae16226f41
224f521a-4ba1-455b-8643-2d84ef222bb2	perles	Perle de l'impératrice (12 ou 6)	1	16.00	t	9a314509-e7cc-4b1d-91e2-0bae16226f41
87911951-303d-4e54-8b52-0c53990a6389	bulots	Bulots (300g)	1	14.00	f	f7ad38c8-4bc0-4ea3-8fff-dd164f7100e4
da4b1a9d-ca01-4e6d-b113-6ed43501259d	perles	Perle de l'impératrice (12 ou 6)	1	16.00	t	f7ad38c8-4bc0-4ea3-8fff-dd164f7100e4
44c7c8b9-ec16-4fec-a208-2626b07d97ef	bulots	Bulots (300g)	1	14.00	f	28a869b0-f8db-44d6-be58-573497652f20
1f9add6f-8f59-4790-bb38-4205e3f6adf9	perles	Perle de l'impératrice (12 ou 6)	1	16.00	t	28a869b0-f8db-44d6-be58-573497652f20
5e643e67-fe7b-476d-bded-3d4517b7e688	bulots	Bulots (300g)	1	14.00	f	1349627e-34de-44be-85a9-0dc6639a40e4
9c7b8b9a-1265-4694-a543-5344669efe49	perles	Perle de l'impératrice (12 ou 6)	1	16.00	t	1349627e-34de-44be-85a9-0dc6639a40e4
e431137f-5ba1-43d8-8d61-46a790c726d1	homard	Homard entier frais & sa mayonnaise	1	71.00	f	52de2aee-8fff-4cb9-b875-54575f834c94
370cadec-ff4e-49dc-93cc-5b5da4718535	homard	Homard entier frais & sa mayonnaise	1	71.00	f	55524f53-c095-441f-b918-d124a8d41fce
4d128a3c-4c20-48fd-9305-d715d5c21699	homard	Homard entier frais & sa mayonnaise	1	71.00	f	188533a5-4b32-4e39-b160-b0b8eb6c5229
1150ee0a-fb19-4200-a1f0-06a7c94455a1	perles	Perle de l'impératrice (12 ou 6)	1	16.00	t	6e089af6-5e09-4550-8abe-1cc7d0333494
5343ff4c-f837-420a-9800-3f4dfae0589c	bulots	Bulots (300g)	1	14.00	f	1b0ccbed-1094-4c99-8165-af38a2187565
c9f54ef1-42a6-42d3-a04e-2cd834865902	crevettes	Bouquet de crevettes (6)	1	12.00	f	49b2092e-0376-4a6f-bfe0-9374a61ee20f
e8f4523f-4d86-4b54-ad6d-b6b01beed715	crevette-grise	Crevette grise fraîches les 100g	1	12.00	f	1a239288-eb69-45de-9a6d-413fcc9d3a68
aa1f81db-f88b-4e5a-a560-497b28db7be8	perles	Perle de l'impératrice (12 ou 6)	1	16.00	t	1a239288-eb69-45de-9a6d-413fcc9d3a68
d24aa7f4-af5e-4dd1-bb23-eb04057cdf9e	crevettes	Bouquet de crevettes (6)	1	12.00	f	7eaf4038-c25e-4d8a-8fdc-47fce4fa4b67
69164ffa-100d-4518-ab52-7de2b2f8205e	bulots	Bulots (300g)	1	14.00	f	679a9d64-2bb3-4fa2-91a1-558ac6fe50aa
da0cae83-aee9-4c46-913c-3e6fecf2ba02	bulots	Bulots (300g)	1	14.00	f	278b18be-2ea8-4cd0-8077-9282b6bfd035
7559c4e3-75c6-4a58-8975-41db8e6ccb65	perles	Perle de l'impératrice (12 ou 6)	2	32.00	f	fb893627-24f8-4f24-ac10-9cf1a579d28a
7cd5f2b4-0d32-4304-8dd9-0e5dfcd83b3d	crevette-grise	Crevette grise fraîches les 100g	1	12.00	f	fb893627-24f8-4f24-ac10-9cf1a579d28a
3562bccc-985b-4d24-b5b5-9c7ae8ed0d4a	bulots	Bulots (300g)	1	14.00	f	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
34d60cfc-2668-43ec-a051-0c5d1452d5f9	crevettes	Bouquet de crevettes (6)	1	12.00	f	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
9602de05-17c5-4de2-b38b-38a475d12b26	crevette-grise	Crevette grise fraîches les 100g	1	12.00	f	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
6058d799-a182-45d2-81ba-9cfe639982ef	tourteau	Tourteau entier frais & sa mayonnaise	1	39.90	f	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
b3e4c94f-788c-4c07-8313-0cbf28a33a79	homard	Homard entier frais & sa mayonnaise	1	71.00	f	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
ad548875-bcb9-44b4-9223-cd135822baaf	langoustine	Langoustine fraîche (la pièce)	1	6.90	f	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
8706eb92-f68f-4525-bdb2-db0be0055261	bulots	Bulots (300g)	1	14.00	f	ab9a9c70-3943-40e4-ab6c-7386de052bd2
1d99818f-1614-4cd4-b3a1-8492841e75c5	bulots	Bulots (300g)	1	14.00	f	d4fc2037-9f71-4e24-b0ed-048e1bbcaa6d
\.


--
-- Data for Name: seafood_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seafood_orders (id, "customerName", "customerPhone", "customerEmail", "pickupDate", "pickupTime", "isPickup", "totalPrice", "specialRequests", status, "createdAt", "updatedAt", "userId") FROM stdin;
9360cf65-04cc-4146-a80c-ff6603600604	test	test	test@gmail.com	2025-04-30	20:00	t	12.00	\N	pending	2025-04-22 16:48:39.423624	2025-04-22 16:48:39.423624	\N
3499864c-28c8-43bc-ad72-6add4c4b104a	test	test	test@gmail.com	2025-04-30	13:30	t	48.00		pending	2025-04-22 16:51:55.954032	2025-04-22 16:51:55.954032	\N
4b2af0d8-4a00-4677-bb44-d30c05efae53	test	test	cialonequentin@gmail.com	2025-04-25	19:00	t	110.90		pending	2025-04-23 00:27:06.757946	2025-04-23 00:27:06.757946	\N
588d0b3a-1929-412d-a0ce-fe376766850d	Cialone	0662495424	cialonequentin@gmail.com	2025-04-29	13:30	t	95.00		pending	2025-04-23 09:55:26.929206	2025-04-23 09:55:26.929206	\N
cbff4376-8016-4037-bea3-5c27206d205f	test	test	test@gmail.com	2025-04-30	12:30	t	100.90		pending	2025-04-23 18:06:06.311042	2025-04-23 18:06:06.311042	\N
50019cf5-2578-4207-a3a6-9e7da21e0042	Cialone Quentin	0662495424	cialonequentin@gmail.com	2025-04-30	14:00	t	14.00		pending	2025-04-24 14:33:22.298635	2025-04-24 14:33:22.298635	\N
9a314509-e7cc-4b1d-91e2-0bae16226f41	Cialone Quentin	0612345678	cialonequentin@gmail.com	2025-04-29	12:30	t	30.00		pending	2025-04-25 13:36:14.769645	2025-04-25 13:36:14.769645	\N
f7ad38c8-4bc0-4ea3-8fff-dd164f7100e4	Cialone Quentin	0612345678	cialonequentin@gmail.com	2025-04-29	12:30	t	30.00		pending	2025-04-25 13:38:48.118238	2025-04-25 13:38:48.118238	\N
28a869b0-f8db-44d6-be58-573497652f20	Cialone Quentin	0612345678	cialonequentin@gmail.com	2025-04-29	12:30	t	30.00		pending	2025-04-25 13:41:01.715175	2025-04-25 13:41:01.715175	\N
1349627e-34de-44be-85a9-0dc6639a40e4	Cialone Quentin	0612345678	cialonequentin@gmail.com	2025-04-29	12:30	t	30.00		pending	2025-04-25 13:44:24.765367	2025-04-25 13:44:24.765367	\N
52de2aee-8fff-4cb9-b875-54575f834c94	cialone quentin	0612345678	cialonequentin@gmail.com	2025-04-30	13:00	t	71.00		pending	2025-04-25 13:46:57.863911	2025-04-25 13:46:57.863911	\N
55524f53-c095-441f-b918-d124a8d41fce	cialone quentin	0612345678	cialonequentin@gmail.com	2025-04-30	12:30	t	71.00		pending	2025-04-25 13:53:27.065532	2025-04-25 13:53:27.065532	\N
188533a5-4b32-4e39-b160-b0b8eb6c5229	Cialone quentin 	0612345678	cialonequentin@gmail.com	2025-04-29	13:00	t	120.00		pending	2025-04-25 13:56:16.141112	2025-04-25 13:56:16.141112	\N
fece4819-cda0-4ac4-bb3c-5d89eaccce2b	cialone quentin	0662495424	cialonequentin@gmail.com	2025-05-02	12:00	t	62.00		pending	2025-04-25 14:34:27.415776	2025-04-25 14:34:27.415776	\N
6e089af6-5e09-4550-8abe-1cc7d0333494	Cialone Quentin	0662495424	cialonequentin@gmail.com	2025-05-03	12:00	t	202.00		pending	2025-04-29 12:21:44.531163	2025-04-29 12:21:44.531163	\N
1b0ccbed-1094-4c99-8165-af38a2187565	Cialone quentin	0662495424	cialonequentin@gmail.com	2025-05-03	12:00	t	33.00		pending	2025-04-29 12:27:38.822843	2025-04-29 12:27:38.822843	\N
49b2092e-0376-4a6f-bfe0-9374a61ee20f	cialone	0662495424	cialonequentin@gmail.com	2025-05-10	18:00	t	61.00		pending	2025-05-05 15:08:34.001636	2025-05-06 12:21:10.204619	\N
1a239288-eb69-45de-9a6d-413fcc9d3a68	cialone	0662495424	cialonequentin@gmail.com	2025-05-16	12:00	t	47.00		pending	2025-05-06 16:27:44.098671	2025-05-06 16:27:44.098671	\N
7eaf4038-c25e-4d8a-8fdc-47fce4fa4b67	cialone quentin	0662495424	qcialone@gmail.com	2025-05-16	12:00	t	74.00	test	pending	2025-05-07 00:22:10.792862	2025-05-07 00:22:10.792862	\N
c78cee90-4105-48ee-8cd8-e2d6b64f41ea	cialone	0662495424	qcialone@gmail.com	2025-05-09	12:00	t	62.00	test	pending	2025-05-07 00:24:34.037912	2025-05-07 00:24:34.037912	\N
679a9d64-2bb3-4fa2-91a1-558ac6fe50aa	cialone quentin	0662495424	cialonequentin@gmail.com	2025-05-15	13:30	t	76.00	test	pending	2025-05-07 13:39:56.453485	2025-05-07 13:39:56.453485	\N
278b18be-2ea8-4cd0-8077-9282b6bfd035	cialone	0612345678	cialonequentin@gmail.com	2025-05-16	12:00	t	63.00	test	pending	2025-05-07 13:43:15.199636	2025-05-07 13:43:15.199636	\N
fb893627-24f8-4f24-ac10-9cf1a579d28a	test	0712345678	cialonequentin@gmail.com	2025-05-17	12:30	t	125.00	test	pending	2025-05-07 13:45:46.794889	2025-05-07 13:45:46.794889	\N
b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7	test	0612345678	cialonequentin@gmail.com	2025-05-10	12:30	t	204.80	test	pending	2025-05-07 14:22:03.389555	2025-05-07 14:22:03.389555	\N
ab9a9c70-3943-40e4-ab6c-7386de052bd2	quentin	0662495424	cialonequentin@gmail.com	2025-05-17	14:00	t	161.00	test	pending	2025-05-07 14:25:38.25927	2025-05-07 14:25:38.25927	\N
d4fc2037-9f71-4e24-b0ed-048e1bbcaa6d	test	0612345678	cialonequentin@gmail.com	2025-05-23	12:00	t	63.00	test	pending	2025-05-07 14:32:53.773068	2025-05-07 14:32:53.773068	\N
\.


--
-- Data for Name: seafood_plateaux; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seafood_plateaux (id, "plateauId", name, quantity, "unitPrice", order_id) FROM stdin;
24c826fc-91b1-4855-9f13-b102b84e0ae3	plateau-ecaille	Plateau de l'écailler	1	49.00	cbff4376-8016-4037-bea3-5c27206d205f
e6b2eaea-f170-48b5-a907-dd1468430119	plateau-ecaille	Plateau de l'écailler	1	49.00	188533a5-4b32-4e39-b160-b0b8eb6c5229
aba16c20-e996-414c-993d-b8d6d2a7159a	plateau-pecheur	Plateau du pêcheur	1	62.00	fece4819-cda0-4ac4-bb3c-5d89eaccce2b
543832ec-9a76-425b-a432-238f00d0138d	plateau-pecheur	Plateau du pêcheur	3	62.00	6e089af6-5e09-4550-8abe-1cc7d0333494
76ddda79-6b95-44e6-a3a6-df9c988b8233	assiette-degustation	Assiette dégustation	1	19.00	1b0ccbed-1094-4c99-8165-af38a2187565
2b950eea-fcf0-414c-a43e-6b690b12811a	plateau-ecaille	Plateau de l'écailler	1	49.00	49b2092e-0376-4a6f-bfe0-9374a61ee20f
27b9a016-25dd-4fd3-b32a-5b08ccc5fa56	assiette-degustation	Assiette dégustation	1	19.00	1a239288-eb69-45de-9a6d-413fcc9d3a68
49ba2a25-3fca-4907-ac74-c1d82556cea7	plateau-pecheur	Plateau du pêcheur	1	62.00	7eaf4038-c25e-4d8a-8fdc-47fce4fa4b67
e4e2b482-eeef-4c62-beb7-3947e473b42b	plateau-pecheur	Plateau du pêcheur	1	62.00	c78cee90-4105-48ee-8cd8-e2d6b64f41ea
0d734245-284e-4d42-83d7-10e3b9990142	plateau-pecheur	Plateau du pêcheur	1	62.00	679a9d64-2bb3-4fa2-91a1-558ac6fe50aa
66090b07-48ea-402b-bcff-95770b3b1d35	plateau-ecaille	Plateau de l'écailler	1	49.00	278b18be-2ea8-4cd0-8077-9282b6bfd035
c983f7ae-3b74-4344-b4a4-7a3a9e62a389	plateau-ecaille	Plateau de l'écailler	1	49.00	fb893627-24f8-4f24-ac10-9cf1a579d28a
91ec21b3-2c59-4140-a37f-1115c0879f1b	plateau-ecaille	Plateau de l'écailler	1	49.00	b6c990b1-d82b-4cd9-a2d6-bd7ce99cf8e7
dc73b858-c572-47ec-9ed3-462f39b5c643	plateau-ecaille	Plateau de l'écailler	3	49.00	ab9a9c70-3943-40e4-ab6c-7386de052bd2
82cf71ab-82e4-414b-a607-4c28d917cb62	plateau-ecaille	Plateau de l'écailler	1	49.00	d4fc2037-9f71-4e24-b0ed-048e1bbcaa6d
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, phone_number, created_at, updated_at) FROM stdin;
3	Quentin	cialonequentin@gmail.com	$2b$10$virgDoATvnQlZ5o5MOnRp.kj/SZCEH5ei8rBdElh2Eid2QQKQIL9e	user	0662495424	2025-04-15 17:20:37.191188	2025-04-15 17:20:37.191188
4	Quentinho	cialoneq@gmail.com	$2b$10$CVHNsyTbcdntzCOgWIl0SemMFMZSo9nE8iG.Ic2Q8SdNDONV7LqES	user	0612345678	2025-04-15 21:57:50.307905	2025-04-15 21:57:50.307905
1	Patron	patron@tikilyon.fr	$2b$10$W64C3J7VMOkqLrx.7lRjYeRQWUvBIOPiO1rEWnlVQ2iAi5NWQsuGW	admin	\N	2025-04-15 17:20:11.346594	2025-04-15 17:20:11.346594
2	Responsable	responsable@tikilyon.fr	$2b$10$soxe.otF92Gt0ns1MoN/cubSlu.EqeNyjwNu8mwmIk2JGwga90YAG	admin	\N	2025-04-15 17:20:11.346594	2025-04-15 17:20:11.346594
5	Quentin	test@test.fr	$2b$10$V93GivSHjgx/Uf7aJBGsy.cBQga6Dr7INxqry7MV8IPKco9fBzi0q	user	0612345678	2025-04-16 17:28:21.688465	2025-04-16 17:28:21.688465
\.


--
-- Data for Name: wines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wines (id, name, region, category, "bottlePrice", "glassPrice") FROM stdin;
3	Macon Tradition - 2022	Domaine Collovray Terrier	blancs	23	5
4	Viognier - 2022	Domaine Janasse	blancs	26	6
5	Côtes du Rhône Temps est venu - 2023	Domaine Stéphane Ogier	blancs	18	\N
6	Crozes Hermitage - 2023	Domaine Laurent Combier - Cuvée L	blancs	30	\N
7	Saint Veran - 2022	Domaine Collovray terrier	blancs	36	7
8	La Begude - 2022	AOP Bandol	roses	43	\N
9	Maur & more	Côtes de provence	roses	35	6
2	Petit Lebrun Grand cru blanc de blanc	 	champagnes	59	13
10	Ruinart Blanc de blanc	 	champagnes	140	\N
1	Santenay - 2022	Domaine Lucien Muzard	rouges	55	\N
11	La roilette - 2022	AOP Fleurie	rouges	36	\N
12	Terre de Bussière - 2022	Domaine de la Janasse IGP	rouges	21	\N
13	SyrahVissante - 2023	Domaine Louis Chèze	rouges	24	\N
\.


--
-- Name: carte_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carte_items_id_seq', 38, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 6, true);


--
-- Name: gallery_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gallery_items_id_seq', 15, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 8, true);


--
-- Name: menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menus_id_seq', 2, true);


--
-- Name: personnel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personnel_id_seq', 6, true);


--
-- Name: reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_id_seq', 54, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: wines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wines_id_seq', 13, true);


--
-- Name: personnel PK_33a7253a5d2a326fec3cdc0baa5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT "PK_33a7253a5d2a326fec3cdc0baa5" PRIMARY KEY (id);


--
-- Name: seafood_orders PK_3bef3bcaf6cf742f2a1fc04e427; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seafood_orders
    ADD CONSTRAINT "PK_3bef3bcaf6cf742f2a1fc04e427" PRIMARY KEY (id);


--
-- Name: menus PK_3fec3d93327f4538e0cbd4349c4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menus
    ADD CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY (id);


--
-- Name: events PK_40731c7151fe4be3116e45ddf73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY (id);


--
-- Name: carte_items PK_5629f149f5a16fe7d1bd52d75f6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carte_items
    ADD CONSTRAINT "PK_5629f149f5a16fe7d1bd52d75f6" PRIMARY KEY (id);


--
-- Name: menu_items PK_57e6188f929e5dc6919168620c8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY (id);


--
-- Name: wines PK_9533c1931b8e10abae016745f61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wines
    ADD CONSTRAINT "PK_9533c1931b8e10abae016745f61" PRIMARY KEY (id);


--
-- Name: seafood_plateaux PK_a8e39b29be1baad7b6cdb4cdf28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seafood_plateaux
    ADD CONSTRAINT "PK_a8e39b29be1baad7b6cdb4cdf28" PRIMARY KEY (id);


--
-- Name: seafood_order_items PK_b090303b655ded4a3d783e6387d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seafood_order_items
    ADD CONSTRAINT "PK_b090303b655ded4a3d783e6387d" PRIMARY KEY (id);


--
-- Name: gallery_items PK_ca2915427d004dec2ff17f45a49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gallery_items
    ADD CONSTRAINT "PK_ca2915427d004dec2ff17f45a49" PRIMARY KEY (id);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: seafood_plateaux FK_b9d4795f02557a253ab1c2289ad; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seafood_plateaux
    ADD CONSTRAINT "FK_b9d4795f02557a253ab1c2289ad" FOREIGN KEY (order_id) REFERENCES public.seafood_orders(id) ON DELETE CASCADE;


--
-- Name: seafood_order_items FK_e22f01f8a85f1bb68ebec7f08b6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seafood_order_items
    ADD CONSTRAINT "FK_e22f01f8a85f1bb68ebec7f08b6" FOREIGN KEY (order_id) REFERENCES public.seafood_orders(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

