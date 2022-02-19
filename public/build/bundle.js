
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_destroy_block(block, lookup) {
        block.f();
        destroy_block(block, lookup);
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function quintOut(t) {
        return --t * t * t * t * t + 1;
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    const [send, receive] = crossfade({
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;
            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
        transform: ${transform} scale(${t});
        opacity: ${t}
      `,
            };
        },
    });

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    const storedForsteko = JSON.parse(localStorage.getItem("forsteko")) || [];
    const forsteko = writable(storedForsteko);
    forsteko.subscribe((value) => {
        localStorage.setItem("forsteko", JSON.stringify(value));
    });
    const storedNteko = JSON.parse(localStorage.getItem("nteko")) || [];
    const nteko = writable(storedNteko);
    nteko.subscribe((value) => {
        localStorage.setItem("nteko", JSON.stringify(value));
    });
    const storedCounter = JSON.parse(localStorage.getItem("counter")) || [];
    const counter = writable(storedCounter);
    counter.subscribe((value) => {
        localStorage.setItem("counter", JSON.stringify(value));
    });
    const modal = writable(null);

    function charToInt(c) {
        // requires c to be in a-z or æøå
        if (RegExp(/^[a-z]+$/).test(c)) {
            return c.charCodeAt(0) - 97;
        }
        else if (c == "æ") {
            return 26;
        }
        else if (c == "ø") {
            return 28;
        }
        else if (c == "å") {
            return 29;
        }
    }
    function generateUniqueIdFromString(name) {
        if (name.length == 1) {
            return charToInt(name);
        }
        const number = name.split("").reduce((prev, cur, idx) => {
            let prevnum = parseInt(prev);
            if (idx === 1) {
                prevnum = charToInt(prev);
            }
            return "" + (prevnum + charToInt(cur) * 30 ** idx);
        });
        return parseInt(number);
    }
    function removeSpecialChars(navn) {
        return navn
            .split("")
            .filter((c) => RegExp(/^[a-zA-ZæøåÆØÅ]+$/).test(c))
            .join("");
    }

    function getFromStore(store) {
        let val;
        store.subscribe(($) => {
            val = $;
        });
        return val;
    }
    function createJSONObject() {
        const forste = getFromStore(forsteko);
        const nte = getFromStore(nteko);
        const count = getFromStore(counter);
        return JSON.stringify([forste, nte, count]);
    }
    function importFromJSONObject(obj) {
        const [forste, nte, count] = JSON.parse(obj);
        forsteko.set(forste);
        nteko.set(nte);
        counter.set(count);
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    /* src\Dialog.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\Dialog.svelte";

    // (28:0) {#if hasForm}
    function create_if_block$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1dke330");
    			add_location(input, file$3, 28, 2, 473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*value*/ ctx[2]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[7]),
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value*/ 4 && input.value !== /*value*/ ctx[2]) {
    				set_input_value(input, /*value*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(28:0) {#if hasForm}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h2;
    	let t0;
    	let t1;
    	let t2;
    	let div;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;
    	let if_block = /*hasForm*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(/*message*/ ctx[0]);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Okay";
    			attr_dev(h2, "class", "svelte-1dke330");
    			add_location(h2, file$3, 25, 0, 434);
    			add_location(button0, file$3, 36, 2, 607);
    			add_location(button1, file$3, 37, 2, 657);
    			attr_dev(div, "class", "buttons svelte-1dke330");
    			add_location(div, file$3, 35, 0, 582);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t4);
    			append_dev(div, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*_onCancel*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*_onOkay*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*message*/ 1) set_data_dev(t0, /*message*/ ctx[0]);

    			if (/*hasForm*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(t2.parentNode, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, []);
    	let { message } = $$props;
    	let { hasForm = false } = $$props;

    	let { onCancel = () => {
    		
    	} } = $$props;

    	let { onOkay = () => {
    		
    	} } = $$props;

    	const { close } = getContext("simple-modal");
    	let value;

    	let onChange = () => {
    		
    	};

    	function _onCancel() {
    		onCancel();
    		close();
    	}

    	function _onOkay() {
    		onOkay(value);
    		close();
    	}

    	const writable_props = ['message', 'hasForm', 'onCancel', 'onOkay'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(2, value);
    	}

    	const keydown_handler = e => e.which === 13 && _onOkay();

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('hasForm' in $$props) $$invalidate(1, hasForm = $$props.hasForm);
    		if ('onCancel' in $$props) $$invalidate(5, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(6, onOkay = $$props.onOkay);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		message,
    		hasForm,
    		onCancel,
    		onOkay,
    		close,
    		value,
    		onChange,
    		_onCancel,
    		_onOkay
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('hasForm' in $$props) $$invalidate(1, hasForm = $$props.hasForm);
    		if ('onCancel' in $$props) $$invalidate(5, onCancel = $$props.onCancel);
    		if ('onOkay' in $$props) $$invalidate(6, onOkay = $$props.onOkay);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('onChange' in $$props) $$invalidate(10, onChange = $$props.onChange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			onChange(value);
    		}
    	};

    	return [
    		message,
    		hasForm,
    		value,
    		_onCancel,
    		_onOkay,
    		onCancel,
    		onOkay,
    		input_input_handler,
    		keydown_handler
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			message: 0,
    			hasForm: 1,
    			onCancel: 5,
    			onOkay: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Dialog> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasForm() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasForm(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onCancel() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCancel(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onOkay() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onOkay(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ExportPopup.svelte generated by Svelte v3.46.4 */

    const file$2 = "src\\ExportPopup.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let t1;
    	let br;
    	let t2;
    	let code;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "copy";
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			code = element("code");
    			t3 = text(/*object*/ ctx[0]);
    			add_location(button, file$2, 8, 0, 144);
    			add_location(br, file$2, 8, 45, 189);
    			add_location(code, file$2, 9, 0, 197);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, code, anchor);
    			append_dev(code, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*copyObject*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*object*/ 1) set_data_dev(t3, /*object*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(code);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExportPopup', slots, []);
    	let { object = "[[], [], []]" } = $$props;

    	const copyObject = () => {
    		navigator.clipboard.writeText(object);
    	};

    	const writable_props = ['object'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExportPopup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('object' in $$props) $$invalidate(0, object = $$props.object);
    	};

    	$$self.$capture_state = () => ({ object, copyObject });

    	$$self.$inject_state = $$props => {
    		if ('object' in $$props) $$invalidate(0, object = $$props.object);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [object, copyObject];
    }

    class ExportPopup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { object: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExportPopup",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get object() {
    		throw new Error("<ExportPopup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set object(value) {
    		throw new Error("<ExportPopup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Main.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\Main.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (192:6) {#each $forsteko.filter((t) => t.erIKo) as timinist (timinist.id)}
    function create_each_block_2(key_1, ctx) {
    	let label;
    	let t0_value = /*timinist*/ ctx[22].navn + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let rect;
    	let stop_animation = noop;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*timinist*/ ctx[22]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "x";
    			t3 = space();
    			attr_dev(button, "class", "delete svelte-q7q1vj");
    			add_location(button, file$1, 194, 10, 5960);
    			attr_dev(label, "class", "svelte-q7q1vj");
    			add_location(label, file$1, 192, 8, 5901);
    			this.first = label;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, button);
    			append_dev(label, t3);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$forsteko*/ 4 && t0_value !== (t0_value = /*timinist*/ ctx[22].navn + "")) set_data_dev(t0, t0_value);
    		},
    		r: function measure() {
    			rect = label.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(label);
    			stop_animation();
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(label, rect, flip, {});
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(192:6) {#each $forsteko.filter((t) => t.erIKo) as timinist (timinist.id)}",
    		ctx
    	});

    	return block;
    }

    // (205:6) {#each $nteko as timinist (timinist.id)}
    function create_each_block_1(key_1, ctx) {
    	let label;
    	let t0_value = /*timinist*/ ctx[22].navn + "";
    	let t0;
    	let t1;
    	let button;
    	let t3;
    	let label_intro;
    	let label_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[11](/*timinist*/ ctx[22]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "x";
    			t3 = space();
    			attr_dev(button, "class", "delete svelte-q7q1vj");
    			add_location(button, file$1, 211, 10, 6402);
    			attr_dev(label, "class", "svelte-q7q1vj");
    			add_location(label, file$1, 205, 8, 6234);
    			this.first = label;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, button);
    			append_dev(label, t3);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$nteko*/ 2) && t0_value !== (t0_value = /*timinist*/ ctx[22].navn + "")) set_data_dev(t0, t0_value);
    		},
    		r: function measure() {
    			rect = label.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(label);
    			stop_animation();
    			add_transform(label, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(label, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, receive, { key: /*timinist*/ ctx[22].id });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, send, { key: /*timinist*/ ctx[22].id });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(205:6) {#each $nteko as timinist (timinist.id)}",
    		ctx
    	});

    	return block;
    }

    // (221:6) {#each $counter as timinist (timinist.id)}
    function create_each_block(key_1, ctx) {
    	let label;
    	let t0_value = /*timinist*/ ctx[22].navn + "";
    	let t0;
    	let t1;
    	let t2_value = /*timinist*/ ctx[22].vaffelcount + "";
    	let t2;
    	let t3;
    	let button0;
    	let t5;
    	let button1;
    	let t7;
    	let label_intro;
    	let label_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			label = element("label");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "+";
    			t5 = space();
    			button1 = element("button");
    			button1.textContent = "-";
    			t7 = space();
    			attr_dev(button0, "class", "increment svelte-q7q1vj");
    			add_location(button0, file$1, 227, 10, 6859);
    			attr_dev(button1, "class", "decrement svelte-q7q1vj");
    			add_location(button1, file$1, 228, 10, 6929);
    			attr_dev(label, "class", "svelte-q7q1vj");
    			add_location(label, file$1, 221, 8, 6667);
    			this.first = label;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			append_dev(label, t1);
    			append_dev(label, t2);
    			append_dev(label, t3);
    			append_dev(label, button0);
    			append_dev(label, t5);
    			append_dev(label, button1);
    			append_dev(label, t7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", click_handler_2, false, false, false),
    					listen_dev(button1, "click", click_handler_3, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$counter*/ 1) && t0_value !== (t0_value = /*timinist*/ ctx[22].navn + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*$counter*/ 1) && t2_value !== (t2_value = /*timinist*/ ctx[22].vaffelcount + "")) set_data_dev(t2, t2_value);
    		},
    		r: function measure() {
    			rect = label.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(label);
    			stop_animation();
    			add_transform(label, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(label, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (label_outro) label_outro.end(1);
    				label_intro = create_in_transition(label, receive, { key: /*timinist*/ ctx[22].id });
    				label_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (label_intro) label_intro.invalidate();
    			label_outro = create_out_transition(label, send, { key: /*timinist*/ ctx[22].id });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching && label_outro) label_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(221:6) {#each $counter as timinist (timinist.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div6;
    	let div1;
    	let input;
    	let input_style_value;
    	let t1;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let div5;
    	let div2;
    	let h20;
    	let t7;
    	let each_blocks_2 = [];
    	let each0_lookup = new Map();
    	let t8;
    	let div3;
    	let h21;
    	let t10;
    	let each_blocks_1 = [];
    	let each1_lookup = new Map();
    	let t11;
    	let div4;
    	let h22;
    	let t13;
    	let each_blocks = [];
    	let each2_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*$forsteko*/ ctx[2].filter(func);
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*timinist*/ ctx[22].id;
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
    	}

    	let each_value_1 = /*$nteko*/ ctx[1];
    	validate_each_argument(each_value_1);
    	const get_key_1 = ctx => /*timinist*/ ctx[22].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key_1);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks_1[i] = create_each_block_1(key, child_ctx));
    	}

    	let each_value = /*$counter*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key_2 = ctx => /*timinist*/ ctx[22].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key_2);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key_2(child_ctx);
    		each2_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div6 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t1 = space();
    			button0 = element("button");
    			button0.textContent = "import";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "export";
    			t5 = space();
    			div5 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Første-kø";
    			t7 = space();

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t8 = space();
    			div3 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Nte-kø";
    			t10 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();
    			div4 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Opptelling";
    			t13 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (!src_url_equal(img.src, img_src_value = "penis.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "penis");
    			attr_dev(img, "width", "33%");
    			add_location(img, file$1, 172, 2, 5188);
    			attr_dev(div0, "id", "penis");
    			set_style(div0, "display", "none");
    			set_style(div0, "position", "absolute");
    			set_style(div0, "top", "0");
    			set_style(div0, "left", "0");
    			add_location(div0, file$1, 171, 0, 5108);
    			attr_dev(input, "class", "new-timinist svelte-q7q1vj");
    			attr_dev(input, "placeholder", "navn eller en av next, skip, reset, import, export");
    			attr_dev(input, "style", input_style_value = "transform: translate3d(" + /*$transformed*/ ctx[3] + "px, 0, 0)");
    			add_location(input, file$1, 177, 4, 5303);
    			attr_dev(button0, "class", "import svelte-q7q1vj");
    			add_location(button0, file$1, 184, 4, 5591);
    			attr_dev(button1, "class", "export svelte-q7q1vj");
    			add_location(button1, file$1, 185, 4, 5659);
    			attr_dev(div1, "class", "input-wrapper svelte-q7q1vj");
    			add_location(div1, file$1, 176, 2, 5270);
    			attr_dev(h20, "class", "svelte-q7q1vj");
    			add_location(h20, file$1, 190, 6, 5799);
    			attr_dev(div2, "class", "column svelte-q7q1vj");
    			add_location(div2, file$1, 189, 4, 5771);
    			attr_dev(h21, "class", "svelte-q7q1vj");
    			add_location(h21, file$1, 203, 6, 6161);
    			attr_dev(div3, "class", "column svelte-q7q1vj");
    			add_location(div3, file$1, 202, 4, 6133);
    			attr_dev(h22, "class", "svelte-q7q1vj");
    			add_location(h22, file$1, 219, 6, 6588);
    			attr_dev(div4, "class", "column svelte-q7q1vj");
    			add_location(div4, file$1, 218, 4, 6560);
    			attr_dev(div5, "class", "column-wrapper svelte-q7q1vj");
    			add_location(div5, file$1, 188, 2, 5737);
    			attr_dev(div6, "class", "board svelte-q7q1vj");
    			add_location(div6, file$1, 175, 0, 5247);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div1);
    			append_dev(div1, input);
    			append_dev(div1, t1);
    			append_dev(div1, button0);
    			append_dev(div1, t3);
    			append_dev(div1, button1);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, div2);
    			append_dev(div2, h20);
    			append_dev(div2, t7);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div2, null);
    			}

    			append_dev(div5, t8);
    			append_dev(div5, div3);
    			append_dev(div3, h21);
    			append_dev(div3, t10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div3, null);
    			}

    			append_dev(div5, t11);
    			append_dev(div5, div4);
    			append_dev(div4, h22);
    			append_dev(div4, t13);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "keydown", /*keydown_handler*/ ctx[9], false, false, false),
    					listen_dev(button0, "click", /*showImport*/ ctx[7], false, false, false),
    					listen_dev(button1, "click", /*showExport*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$transformed*/ 8 && input_style_value !== (input_style_value = "transform: translate3d(" + /*$transformed*/ ctx[3] + "px, 0, 0)")) {
    				attr_dev(input, "style", input_style_value);
    			}

    			if (dirty & /*skipById, $forsteko*/ 68) {
    				each_value_2 = /*$forsteko*/ ctx[2].filter(func);
    				validate_each_argument(each_value_2);
    				for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].r();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key, 1, ctx, each_value_2, each0_lookup, div2, fix_and_destroy_block, create_each_block_2, null, get_each_context_2);
    				for (let i = 0; i < each_blocks_2.length; i += 1) each_blocks_2[i].a();
    			}

    			if (dirty & /*$nteko, skipById*/ 66) {
    				each_value_1 = /*$nteko*/ ctx[1];
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key_1);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_1, 1, ctx, each_value_1, each1_lookup, div3, fix_and_outro_and_destroy_block, create_each_block_1, null, get_each_context_1);
    				for (let i = 0; i < each_blocks_1.length; i += 1) each_blocks_1[i].a();
    				check_outros();
    			}

    			if (dirty & /*$counter*/ 1) {
    				each_value = /*$counter*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context, get_key_2);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_2, 1, ctx, each_value, each2_lookup, div4, fix_and_outro_and_destroy_block, create_each_block, null, get_each_context);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div6);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].d();
    			}

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function penis(input) {
    	document.getElementById("penis").style.display = document.getElementById("penis").style.display === "none"
    	? "block"
    	: "none";

    	input.value = "";
    }

    const func = t => t.erIKo;
    const click_handler_2 = () => true;
    const click_handler_3 = () => true;

    function instance$2($$self, $$props, $$invalidate) {
    	let $counter;
    	let $nteko;
    	let $forsteko;
    	let $transformed;
    	validate_store(counter, 'counter');
    	component_subscribe($$self, counter, $$value => $$invalidate(0, $counter = $$value));
    	validate_store(nteko, 'nteko');
    	component_subscribe($$self, nteko, $$value => $$invalidate(1, $nteko = $$value));
    	validate_store(forsteko, 'forsteko');
    	component_subscribe($$self, forsteko, $$value => $$invalidate(2, $forsteko = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const { open } = getContext("simple-modal");
    	const transformed = tweened(0, { duration: 100, easing: cubicOut });
    	validate_store(transformed, 'transformed');
    	component_subscribe($$self, transformed, value => $$invalidate(3, $transformed = value));

    	function shake() {
    		transformed.set(-1).then(() => transformed.set(2)).then(() => transformed.set(-4)).then(() => transformed.set(4)).then(() => transformed.set(0));
    	}

    	function handleInput(input) {
    		let navn = input.value;
    		navn = navn.toLocaleLowerCase();
    		navn = removeSpecialChars(navn);

    		if (["n", "next"].includes(navn)) {
    			next(input);
    		} else if (["s", "skip"].includes(navn)) {
    			if (skip()) {
    				input.value = "";
    			}
    		} else if (["reset"].includes(navn)) {
    			reset(input);
    		} else if (["export"].includes(navn)) {
    			eksporter(input);
    		} else if (["import"].includes(navn)) {
    			importer(input);
    		} else if (["penis"].includes(navn)) {
    			penis(input);
    		} else {
    			add(input);
    		}
    	}

    	function add(input) {
    		let navn = input.value;
    		navn = navn.toLowerCase();
    		navn = removeSpecialChars(navn);
    		const id = generateUniqueIdFromString(navn);

    		if ($forsteko.filter(timinist => timinist.navn === navn).length == 0) {
    			set_store_value(counter, $counter = [...$counter, { navn, vaffelcount: 0, id }], $counter);
    			set_store_value(forsteko, $forsteko = [...$forsteko, { navn, erIKo: true, id }], $forsteko);
    			input.value = "";
    		} else if ($nteko.filter(timinist => timinist.navn == navn).length == 0 && $forsteko.filter(timinist => timinist.navn === navn).at(0).erIKo === false) {
    			set_store_value(nteko, $nteko = [...$nteko, { navn, id }], $nteko);
    			input.value = "";
    		} else {
    			shake();
    		}
    	}

    	function next(input) {
    		let popped;

    		if ($forsteko.filter(timinist => timinist.erIKo).length > 0) {
    			const idx = $forsteko.findIndex(timinist => timinist.erIKo);
    			$forsteko.at(idx).erIKo = false;
    			popped = $forsteko.at(idx);
    			forsteko.set($forsteko);
    		} else if ($nteko.length > 0) {
    			popped = $nteko.splice(0, 1).at(0);
    			nteko.set($nteko);
    		} else {
    			shake();
    			return;
    		}

    		$counter.at($counter.findIndex(timinist => timinist.navn == popped.navn)).vaffelcount += 1;
    		counter.set($counter);
    		input.value = "";
    	}

    	function skip() {
    		if ($forsteko.filter(timinist => timinist.erIKo).length > 0) {
    			const idx = $forsteko.findIndex(timinist => timinist.erIKo);
    			const name = $forsteko.at(idx).navn;
    			$forsteko.splice(idx, 1);
    			$counter.findIndex(timinist => timinist.navn == name);
    			$counter.splice(idx, 1);
    			forsteko.set($forsteko);
    			counter.set($counter);
    		} else if ($nteko.length > 0) {
    			$nteko.splice(0, 1);
    			nteko.set($nteko);
    		} else {
    			shake();
    			return false;
    		}

    		return true;
    	}

    	function skipById(id, ko) {
    		if (ko === "forste") {
    			const idx = $forsteko.findIndex(timinist => timinist.id == id);
    			$forsteko.splice(idx, 1);
    			const countidx = $counter.findIndex(timinist => timinist.id == id);
    			$counter.splice(countidx, 1);
    			forsteko.set($forsteko);
    			counter.set($counter);
    		} else if (ko === "nte") {
    			const idx = $nteko.findIndex(timinist => timinist.id == id);
    			$nteko.splice(idx, 1);
    			nteko.set($nteko);
    		}
    	}

    	function reset(input) {
    		set_store_value(forsteko, $forsteko = [], $forsteko);
    		set_store_value(nteko, $nteko = [], $nteko);
    		set_store_value(counter, $counter = [], $counter);
    		input.value = "";
    	}

    	function eksporter(input) {
    		const obj = createJSONObject();
    		navigator.clipboard.writeText(obj);
    		input.value = "";
    	}

    	function importer(input) {
    		navigator.clipboard.readText().then(obj => importFromJSONObject(obj));
    		input.value = "";
    	}

    	const onCancel = () => {
    		
    	};

    	const onOkayImport = text => {
    		importFromJSONObject(text);
    	};

    	const showImport = () => {
    		open(
    			Dialog,
    			{
    				message: "Lim inn JSON-objekt",
    				hasForm: true,
    				onCancel,
    				onOkay: onOkayImport
    			},
    			{
    				closeButton: true,
    				closeOnEsc: true,
    				closeOnOuterClick: true
    			}
    		);
    	};

    	const showExport = () => {
    		open(ExportPopup, { object: createJSONObject() });
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = event => event.key === "Enter" && handleInput(event.currentTarget);
    	const click_handler = timinist => skipById(timinist.id, "forste");
    	const click_handler_1 = timinist => skipById(timinist.id, "nte");

    	$$self.$capture_state = () => ({
    		flip,
    		send,
    		receive,
    		tweened,
    		forsteko,
    		nteko,
    		counter,
    		generateUniqueIdFromString,
    		removeSpecialChars,
    		createJSONObject,
    		importFromJSONObject,
    		cubicOut,
    		Dialog,
    		ExportPopup,
    		getContext,
    		open,
    		transformed,
    		shake,
    		handleInput,
    		add,
    		next,
    		skip,
    		skipById,
    		reset,
    		eksporter,
    		importer,
    		penis,
    		onCancel,
    		onOkayImport,
    		showImport,
    		showExport,
    		$counter,
    		$nteko,
    		$forsteko,
    		$transformed
    	});

    	return [
    		$counter,
    		$nteko,
    		$forsteko,
    		$transformed,
    		transformed,
    		handleInput,
    		skipById,
    		showImport,
    		showExport,
    		keydown_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\Modal.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1, window: window_1 } = globals;
    const file = "src\\Modal.svelte";

    // (397:0) {#if Component}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-1ntvkus"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file, 440, 8, 11454);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-1ntvkus"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file, 412, 6, 10479);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-1ntvkus"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file, 406, 4, 10340);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-1ntvkus"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file, 397, 2, 10085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[48](div1);
    			/*div2_binding*/ ctx[49](div2);
    			/*div3_binding*/ ctx[50](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-1ntvkus"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-1ntvkus"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-1ntvkus"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-1ntvkus"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[48](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[49](null);
    			/*div3_binding*/ ctx[50](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(397:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (428:8) {#if state.closeButton}
    function create_if_block_1(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(428:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (431:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-1ntvkus"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file, 431, 12, 11194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-1ntvkus"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(431:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (429:10) {#if isFunction(state.closeButton)}
    function create_if_block_2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(429:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[47].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[46], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[46],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[46])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[46], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;
    	let { show = null } = $$props;
    	let { key = "simple-modal" } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, "$1-").toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, "")
    	: "";

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch("open");

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch("opening"); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch("close");

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch("closing"); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch("opened");
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch("closed");
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === "Escape") {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === "Tab" && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll("*");

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = "fixed";
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = "hidden";
    		document.body.style.width = "100%";
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || "";
    		document.body.style.top = "";
    		document.body.style.overflow = prevBodyOverflow || "";
    		document.body.style.width = prevBodyWidth || "";
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(45, isMounted = true);
    	});

    	const writable_props = [
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(46, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(45, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 4194304 | $$self.$$.dirty[1] & /*isMounted*/ 16384) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				show: 22,
    				key: 23,
    				ariaLabel: 24,
    				ariaLabelledBy: 25,
    				closeButton: 26,
    				closeOnEsc: 27,
    				closeOnOuterClick: 28,
    				styleBg: 29,
    				styleWindowWrap: 30,
    				styleWindow: 31,
    				styleContent: 32,
    				styleCloseButton: 33,
    				classBg: 34,
    				classWindowWrap: 35,
    				classWindow: 36,
    				classContent: 37,
    				classCloseButton: 38,
    				unstyled: 0,
    				setContext: 39,
    				transitionBg: 40,
    				transitionBgProps: 41,
    				transitionWindow: 42,
    				transitionWindowProps: 43,
    				disableFocusTrap: 44
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    // (7:0) <Modal show={$modal}>
    function create_default_slot(ctx) {
    	let main;
    	let current;
    	main = new Main({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(main.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(main, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(main.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(main.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(main, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(7:0) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let modal_1;
    	let current;

    	modal_1 = new Modal({
    			props: {
    				show: /*$modal*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_1_changes = {};
    			if (dirty & /*$modal*/ 1) modal_1_changes.show = /*$modal*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $modal;
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, $$value => $$invalidate(0, $modal = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Main, Modal, modal, $modal });
    	return [$modal];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var app = new App({
        target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
