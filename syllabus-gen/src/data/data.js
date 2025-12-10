export const Courses = [
  // ⭐ COURSE 1 — Operating Systems
  {
    id:1,
    department: "CSE",
    sem: 4,
    course_title: "Operating Systems",
    course_code: "CSE402",
    course_type: "Core (T)",
    credits: 4,
    cie: 40,
    see: 60,
    ltps: "3:1:0:2",
    exam_hours: 3,

    course_objectives:
      "Learn processes, threads, CPU scheduling, memory systems.",

    course_outcomes:
      "Upon completing this course, students will be able to understand the fundamental design principles of modern operating systems, analyze different process scheduling algorithms, explain the role of CPU schedulers, implement inter-process communication mechanisms, evaluate deadlock detection and avoidance techniques, compare various memory management strategies including paging and segmentation, understand virtual memory and its role in system performance, explain file system layouts and allocation strategies, and gain sufficient practical exposure to use Linux-based operating systems for system-level programming tasks. Students will also be able to relate operating system concepts with real-world computing scenarios.",

    teaching_learning:
      "Teaching–learning activities include conceptual lectures complemented with real-time demonstrations, Linux shell script labs, hands-on system call implementation exercises, simulation-based mini-projects on scheduling algorithms, and guided exploration of OS internals. Active learning strategies such as think-pair-share, debugging-based exercises, and incremental coding tasks will be used to make students understand the underlying OS mechanisms deeply.",

    referral_links:
      "https://man7.org/linux/man-pages/",

    activity_based:
      "Simulate memory allocation and CPU scheduling algorithms.",

    textbooks: [
      {
        slNo: "1",
        author: "Abraham Silberschatz",
        bookTitle: "Operating System Concepts",
        publisher: "Wiley"
      }
    ],

    modules: [
      {
        title: "Introduction to OS",
        chapter: "1",
        textbook: "1",
        rbt: "2",
        content:
          "Overview of operating systems, evolution of OS structures, computer system architecture, interaction between hardware and OS, types of OS: batch, multiprogramming, time-sharing, distributed, and real-time systems. Introduction to system calls, OS components, and basic services. Detailed discussion on how OS acts as an interface between user applications and hardware."
      },
      {
        title: "Processes & Threads",
        chapter: "2–3",
        textbook: "1",
        rbt: "3",
        content:
          "Process scheduling, PCB structure, context switching, process states, thread models, multithreading benefits, user-level and kernel-level threads. Detailed comparison of scheduling algorithms including FCFS, SJF, Round Robin, and Priority Scheduling. Real-world examples of threading in web servers and distributed systems."
      },
      {
        title: "CPU Scheduling",
        chapter: "4",
        textbook: "1",
        rbt: "4",
        content:
          "Deterministic and real-time scheduling, scheduling criteria, multilevel queue scheduling, multilevel feedback queue, scheduling performance evaluation. In-depth explanation of fairness, throughput, and starvation handling. Illustrations and case studies from Linux Completely Fair Scheduler (CFS)."
      },
      {
        title: "Memory Management",
        chapter: "8",
        textbook: "1",
        rbt: "4",
        content:
          "Contiguous and non-contiguous memory allocation, paging, segmentation, TLB operations, multi-level page tables, inverted page tables, page faults, demand paging, replacement algorithms like LRU, optimal, and FIFO. Practical examples of how modern OS use memory optimizations to increase performance."
      },
      {
        title: "File Systems",
        chapter: "10",
        textbook: "1",
        rbt: "3",
        content:
          "File system structure, directory implementation, allocation methods (contiguous, linked, indexed), free-space management, journaling file systems, FAT vs NTFS vs ext4 comparisons, inode structures, file metadata handling. Case study on Linux VFS architecture."
      }
    ],

    experiments: null,
    copoMapping: null,
    pedagogy: ""
  },

  // ⭐ COURSE 2 — Operating Systems Principles
  {
    department: "CSE",
    sem: 2,
    course_title: "Operating Systems Principles",
    course_code: "CSD402",
    course_type: "Core (T)",
    credits: 4,
    cie: 50,
    see: 50,
    ltps: "3:1:0:2",
    exam_hours: 3,

    course_objectives:
      "Understand OS design, process management, memory and IO handling.",

    course_outcomes:
      "Students will be able to explain advanced OS design principles, compare and critique various scheduling policies, demonstrate the use of synchronization primitives in concurrent environments, evaluate deadlock avoidance and recovery techniques, analyze virtual memory concepts, understand filesystem structures, and investigate OS behavior using system tools. The learners will explore OS performance, reliability, and security considerations, enabling them to use OS knowledge in system software development and research applications.",

    teaching_learning:
      "Teaching includes in-depth theoretical explanations supported by animations of OS internals, hands-on sessions using Linux kernel source, practical implementation of semaphores and message queues, debugging practice using strace, and analysis of process behavior using tools like ps, top, and htop. Students also participate in mini-projects involving filesystem analysis or scheduling simulators.",

    referral_links:
      "https://pages.cs.wisc.edu/~remzi/OSTEP/, https://www.kernel.org/",

    activity_based:
      "Implement process synchronization using semaphores.",

    textbooks: [
      {
        slNo: "1",
        author: "Remzi H. Arpaci-Dusseau",
        bookTitle: "Operating Systems: Three Easy Pieces",
        publisher: "Arpaci-Dusseau Books"
      }
    ],

    modules: [
      {
        title: "System Calls",
        chapter: "1",
        textbook: "1",
        rbt: "2",
        content:
          "User-kernel boundary, interrupts, traps, system call interface, library wrappers, debugging system calls, practical exploration using strace. Explanation of fork(), exec(), wait(), and pipe() with examples."
      },
      {
        title: "Process Management",
        chapter: "2–3",
        textbook: "1",
        rbt: "3",
        content:
          "Advanced process scheduling, multiprogramming, CPU burst prediction, preemption, starvation handling. Discussion on real-time (RTOS) scheduling and fairness guarantees in multi-core scheduling."
      },
      {
        title: "IPC & Deadlocks",
        chapter: "4",
        textbook: "1",
        rbt: "3",
        content:
          "Message passing, shared memory, semaphore-based locking, producer-consumer patterns, readers-writers synchronization, detection and recovery from deadlocks, resource-allocation graphs."
      },
      {
        title: "Memory Management",
        chapter: "8",
        textbook: "1",
        rbt: "4",
        content:
          "Virtual memory deep dive, swapping, copy-on-write, kernel memory management, buddy allocator, slab allocator, memory fragmentation issues. Discussion on real OS memory leaks and memory debugging."
      },
      {
        title: "File Systems",
        chapter: "10",
        textbook: "1",
        rbt: "3",
        content:
          "Journaling, log-structured file systems, distributed file systems like NFS, metadata caching, file I/O optimization, and system reliability concerns."
      }
    ],

    experiments: null,
    copoMapping: null,
    pedagogy: ""
  },

  // ⭐ COURSE 3 — Database Management Systems
  {
    id:3,
    department: "ISE",
    sem: 5,
    course_title: "Database Management Systems",
    course_code: "ISD301",
    course_type: "Elective (T)",
    credits: 3,
    cie: 30,
    see: 70,
    ltps: "2:3:0:0",
    exam_hours: 3,

    course_objectives:
      "Design relational databases, write SQL queries, understand normalization.",

    course_outcomes:
      "Students will be able to construct ER diagrams, convert conceptual models to relational schemas, apply relational algebra operators, write optimized SQL queries, understand indexing and query processing, apply normalization rules to improve schema efficiency, understand transaction properties, identify concurrency problems, and implement locking-based solutions. They will also appreciate real-world DBMS architectures and performance considerations.",

    teaching_learning:
      "Teaching strategies include ER diagramming workshops, SQL coding labs, guided exercises on relational algebra transformations, real-world dataset modeling practice, case studies on poorly designed schemas, normalization problem-solving sessions, and practical transaction simulation using PostgreSQL. Students also analyze execution plans using EXPLAIN ANALYZE.",

    referral_links:
      "https://www.w3schools.com/sql, https://dev.mysql.com/doc/",

    activity_based:
      "Design an e-commerce database and optimize queries.",

    textbooks: [
      {
        slNo: "1",
        author: "Raghu Ramakrishnan",
        bookTitle: "Database Management Systems",
        publisher: "McGraw Hill"
      }
    ],

    modules: [
      {
        title: "DBMS & Data Modeling",
        chapter: "1",
        textbook: "1",
        rbt: "3",
        content:
          "Database concepts, need for DBMS, ER/EER modeling, attributes, keys, participation constraints, structural constraints, generalization and specialization, aggregation, mapping ER diagrams to schema."
      },
      {
        title: "Relational Model",
        chapter: "2",
        textbook: "1",
        rbt: "3",
        content:
          "Relational schema terminology, constraints, relational algebra operations, expression trees, optimization opportunities, equivalence rules."
      },
      {
        title: "SQL Queries",
        chapter: "3",
        textbook: "1",
        rbt: "3",
        content:
          "Joins, nested queries, triggers, views, stored procedures, indexing, subqueries, analytic functions, SQL injection security."
      },
      {
        title: "Normalization",
        chapter: "4",
        textbook: "1",
        rbt: "3",
        content:
          "Functional dependencies, minimal covers, 1NF, 2NF, 3NF, BCNF, multivalued dependencies, 4NF. Detailed real-world examples and counterexamples."
      },
      {
        title: "Transactions",
        chapter: "6",
        textbook: "1",
        rbt: "3",
        content:
          "ACID properties, concurrency problems (lost update, dirty read), serializability, locking, timestamp ordering, crash recovery basics."
      }
    ],

    experiments: null,
    copoMapping: null,
    pedagogy: ""
  },

  // ⭐ COURSE 4 — Introduction to Machine Learning
  {
    id:4,
    department: "AIML",
    sem: 6,
    course_title: "Introduction to Machine Learning",
    course_code: "AID603",
    course_type: "Core (T)",
    credits: 4,
    cie: 60,
    see: 40,
    ltps: "3:1:0:2",
    exam_hours: 3,

    course_objectives:
      "Understand supervised and unsupervised algorithms and implement ML models.",

    course_outcomes:
      "Students will acquire the ability to preprocess datasets, understand statistical learning foundations, implement regression and classification algorithms, evaluate model performance using various metrics, build clustering models, analyze bias-variance tradeoff, understand overfitting vs underfitting, implement dimensionality reduction, and develop end-to-end machine learning pipelines with modern tools. They also gain exposure to neural networks and deep learning fundamentals.",

    teaching_learning:
      "Teaching methodology includes Python coding labs using NumPy/pandas/scikit-learn, visualizations with Matplotlib, case studies of real datasets, hands-on implementation of ML algorithms from scratch, performance tuning exercises, Kaggle-style mini projects, and flipped classroom discussions to reinforce algorithmic intuition.",

    referral_links:
      "https://scikit-learn.org/, https://tensorflow.org/",

    activity_based:
      "Build an image classifier.",

    textbooks: [
      {
        slNo: "1",
        author: "Tom Mitchell",
        bookTitle: "Machine Learning",
        publisher: "McGraw Hill"
      }
    ],

    modules: [
      {
        title: "Data Preprocessing",
        chapter: "1",
        textbook: "1",
        rbt: "2",
        content:
          "Data cleaning, handling missing values, standardization, normalization, encoding categorical data, outlier treatment, data visualization for exploratory analysis. Discussion on feature engineering basics."
      },
      {
        title: "Regression & Classification",
        chapter: "2",
        textbook: "1",
        rbt: "3",
        content:
          "Linear regression, multiple regression, logistic regression, KNN classifier, decision boundaries, cost functions, gradient descent, regularization (L1/L2), classification metrics."
      },
      {
        title: "Clustering",
        chapter: "3",
        textbook: "1",
        rbt: "3",
        content:
          "K-Means clustering, hierarchical clustering, similarity measures, silhouette score, clustering evaluation, clustering applications in real analytics."
      },
      {
        title: "Model Evaluation",
        chapter: "4",
        textbook: "1",
        rbt: "4",
        content:
          "Train-test split, cross-validation, confusion matrix, precision, recall, F1-score, ROC curves, AUC. Avoiding overfitting using regularization and data augmentation."
      },
      {
        title: "Neural Networks",
        chapter: "5",
        textbook: "1",
        rbt: "4",
        content:
          "Artificial neurons, activation functions, forward propagation, backpropagation, basic deep learning architectures, introduction to TensorFlow and PyTorch."
      }
    ],

    experiments: null,
    copoMapping: null,
    pedagogy: ""
  },

  // ⭐ COURSE 5 — Computer Networks
  {
    id:5,
    department: "CSE",
    sem: 5,
    course_title: "Computer Networks",
    course_code: "CSD403",
    course_type: "Core (T)",
    credits: 3,
    cie: 50,
    see: 50,
    ltps: "3:0:0:2",
    exam_hours: 3,

    course_objectives:
      "Understand OSI layers, protocols, routing, and communication systems.",

    course_outcomes:
      "Students will be able to explain the role of each OSI layer, analyze communication protocols, understand error-handling mechanisms, apply subnetting and IP addressing, compare routing algorithms, evaluate congestion control methods, analyze real traffic using packet sniffers, and explore application layer protocols like HTTP, DNS, SMTP. They also understand network security basics and wireless networking.",

    teaching_learning:
      "Teaching includes layer-wise conceptual presentations, packet analysis labs using Wireshark, real-time demonstrations of ARP, DHCP, and DNS, subnetting workshop sessions, routing visualization tools, and demos of TCP handshake and flow control. Students practice designing small networks and testing them using simulators like Cisco Packet Tracer.",

    referral_links:
      "https://www.tcpipguide.com/, https://tools.ietf.org/",

    activity_based:
      "Analyze network packets.",

    textbooks: [
      {
        slNo: "1",
        author: "Andrew S. Tanenbaum",
        bookTitle: "Computer Networks",
        publisher: "Pearson"
      }
    ],

    modules: [
      {
        title: "OSI & TCP/IP Models",
        chapter: "1",
        textbook: "1",
        rbt: "2",
        content:
          "Layer responsibilities, encapsulation, protocol data units, real-world mapping between OSI and TCP/IP models, examples of applications using TCP vs UDP, detailed explanation of data flow through layers."
      },
      {
        title: "Data Link Layer",
        chapter: "2",
        textbook: "1",
        rbt: "3",
        content:
          "Error detection codes (CRC, checksum), framing, MAC sublayer, CSMA/CD, CSMA/CA, switch and bridge functionality, spanning tree protocol, Ethernet frame structure."
      },
      {
        title: "Network Layer",
        chapter: "3",
        textbook: "1",
        rbt: "3",
        content:
          "IP addressing, IPv4 vs IPv6, routing algorithms (RIP, OSPF, BGP basics), fragmentation, packet forwarding, NAT, CIDR. Real router configuration examples."
      },
      {
        title: "Transport Layer",
        chapter: "4",
        textbook: "1",
        rbt: "4",
        content:
          "TCP handshake, flow control, congestion control algorithms like AIMD, UDP characteristics, port numbers, socket programming basics."
      },
      {
        title: "Application Layer",
        chapter: "5",
        textbook: "1",
        rbt: "2",
        content:
          "DNS resolution process, HTTP lifecycle, email protocols, DHCP server workflow, P2P and CDN architecture basics."
      }
    ],

    experiments: null,
    copoMapping: null,
    pedagogy: ""
  }
];




export const DataSchema = {
    sem:"",
    course_title:"",
    course_code:"",
    course_type:"",
    credits:"",
    pedagogy:"",
    cie:"",
    see:"",
    ltps:"",
    exam_hours:"",
    course_objectives:"",
    course_outcomes:"",
    teaching_learning:"",
    referral_links:"",
    textbooks:[],
    modules:[
  {
    "no": 1
  },
  {
    "no": 2
  },
  {
    "no": 3
  },
  {
    "no": 4
  },
  {
    "no": 5
  }
],
    activity_based:"",
}
